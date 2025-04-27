import {db} from "../libs/db.js";
import { getJudge0LanguageID } from "../libs/judge0.lib.js";

export const createProblemController = async (req,res) =>{
    // get all the data from the request body

    const {title,desciption,difficulty,tags,examples,constraints,testcases,codeSnippets,referenceSolutions} = req.body;
    //going to check the user role once again

    if(req.user.role !=="ADMIN"){
        return res.status(403).json({ error: "you are not allowed to create a problem"})
    }
    //loop through each 

    try {
        for(const [language,solutionCode] of Object.entries(referenceSolutions)){
            const languageId = getJudge0LanguageID(language);
        
            if(!languageId){
                return res.status(400).json({ error: `Language ${language} is not supported`})


            }

            const submissions = testcases.map(({input,output})=>({
                source_code:solutionCode,
                language_id:languageId,
                stdin:input,
                expected_output:output,
            }))

            const submissionResults = await submitBatch(submissions)

            const tokens = submissionResults.map((res)=>res.token)
            
            const results  = await pollBatchResults(tokens)

            for (let i = 0; i < results.length ; i++) {
                const result = results[i];

                if(result.status.id !== 3){
                    return res.status(400).json({ error: `Testcase ${i+1} failed for language ${language}`})
                }      
            }


            const newProblem = await db.problem.create({
                data:{
                    title,desciption,difficulty,tags,examples,constraints,testcases,codeSnippets,referenceSolutions, userId:req.user.id,
                }
            });

            return res.status(201).json(newProblem);
        }
    } catch (error) {
        
    }



}

export const getAllProblemController = async (req,res) =>{}

export const getProblemByIDController = async (req,res) =>{}

export const updateProblemByIDController = async (req,res) =>{}

export const deleteProblemByIDController = async (req,res) =>{}

export const getAllSolvedProblemByUserController = async (req,res) =>{}