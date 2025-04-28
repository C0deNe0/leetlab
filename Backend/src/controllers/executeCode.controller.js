import { pollBatchResults, submitBatch } from "../libs/judge0.lib";


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


    } catch (error) {
        return res.status(500).json({
            error:"error while submitting the judge0 response"
        })
    }
}