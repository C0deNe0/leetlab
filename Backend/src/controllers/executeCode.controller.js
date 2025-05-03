import { all } from "axios";
import { getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.lib";
import { json } from "express";


export const executeCode = async(req,res)=>{
    try {
        const {source_code, language_id,stdin,expected_outputs, problemId} = req.body;
    
        const userId = req.user.id;

        //validate test case ==> if they are in array format or not
        if(!Array.isArray(stdin) || stdin.length === 0 || !Array.isArray(expected_outputs) || expected_outputs.length !== stdin.length) {
             return res.stdin(400).json({
                error: "Invalid or missing test cases"
             })
        }
    

        // prepare each test cases for judge0 batch 
        const submissions = stdin.map((input)=>({
            source_code,
            language_id,
            stdin:input,
        
        }))

// send batch of submissions to judge0
        const submitResponse = await submitBatch(submissions);

        const tokens = submitResponse.map((res)=> res.token);

        // polling judge0 for the results of all the submitted test cases
        const results = await pollBatchResults(tokens)
        

        // analyzing test case results
        let allPassed = true;

        const detailedResults = results.map((result,i)=>{
            const stdout = result.stdout?.trim();
            const expected_output = expected_outputs[i]?.trim(); 
            const passed = stdout === expected_output;

            if(!passed) allPassed =false;

            return {
                testCase : i+1,
                passed,
                stdout,
                expected: expected_output,
                stderr: result.stderr || null,
                compile_output:result.compile_output ||null,
                status:result.status.description,
                memory:result.memory ? `${result.memory} KB` : undefined,
                time:result.time ? `${result.time} s` : undefined
            }

            //verifying this
            // console.log(`Testcase #${i+1}`)
            // console.log(`Input ${stdin[i]}`)
            // console.log(`expected output for testcase ${expected_output}`)
            // console.log(`actual output ${stdout}`)
            // console.log(`Matched testcase #${i+1}: ${passed}`)
            
        })
            //STORE SUBMISSION SUMMARY
            const submission = await db.submission.create({

                data:{
                    userId,
                    problemId,
                    sourceCode:source_code,
                    language:getLanguageName(language_id),
                    stdin:stdin.join("\n"),
                    stdout:JSON.stringify(detailedResults.map((r)=> r.stdout)) ,
                    stderr: detailedResults.some((r)=> r.stderr) ? JSON.stringify(detailedResults.map((r)=> r.stderr)) : null,
                    compileOutput: detailedResults.some((r)=> r.compile_output) ? JSON.stringify(detailedResults.map((r)=> r.compile_output)) : null,
                    status:allPassed ? "accepted ": "wrong answer",
                    memory:detailedResults.some((r) => r.time) ? JSON.stringify(detailedResults.map((r)=> r.memory)) : null,
                    time: detailedResults.some((r)=> r.memory) ? JSON.stringify(detailedResults.map((r)=> r.time)) : null,
                }         
                

                //if all passed show it to user


        });

        if(allPassed){{

            await db.ProblemSolved({
            where:{
                userId_problemId:{
                    userId,problemId
                }
            },
            update:{},
            create:{
                userId,problemId
            }

        
    })

    // save indivisual test case results using detailed
    const testCaseResults = detailedResults.map((result)=>({
        submissionId:submission.id,
        testCase: result.testCase,

    }))

    await db.testCaseResults.createMany({
        data:testCaseResults
    })

    const submissionWithTestCase = await db.submission.findUnique({
        where:{
            id:submission.id
        },
        include:{
            testCase:true,
        },
    })

        res.status(200).json({
            Message:" code executed"
        })
} 
}

}
catch (error) {
    return res.status(500).json({
        error:"error while submitting the judge0 response"
    })
}
}       