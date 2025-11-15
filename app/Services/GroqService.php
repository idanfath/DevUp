<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GroqService
{
    protected string $apiKey;

    protected string $baseUrl = 'https://api.groq.com/openai/v1/chat/completions';

    protected string $model = 'llama-3.3-70b-versatile';

    public function __construct()
    {
        $this->apiKey = config('services.groq.api_key');
    }

    /**
     * Generate a coding challenge based on parameters
     */
    public function generateChallenge(string $language, string $difficulty, string $gameType, string $prompt, array $recentProblems = []): array
    {
        $systemPrompt = $this->buildChallengePrompt($language, $difficulty, $gameType, $prompt, $recentProblems);

        try {
            $response = $this->makeRequest($systemPrompt);

            return $this->parseChallengeResponse($response, $gameType);
        } catch (\Exception $e) {
            Log::error('Groq Challenge Generation Failed: '.$e->getMessage());

            // Return fallback challenge
            return $this->getFallbackChallenge($language, $difficulty, $gameType);
        }
    }

    /**
     * Evaluate and score submitted code
     */
    public function evaluateCode(
        string $question,
        string $submittedCode,
        string $language,
        string $gameType,
        string $prompt
    ): array {
        $systemPrompt = $this->buildScoringPrompt($question, $submittedCode, $language, $gameType, $prompt);

        try {
            $response = $this->makeRequest($systemPrompt);

            return $this->parseScoringResponse($response);
        } catch (\Exception $e) {
            Log::error('Groq Code Evaluation Failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'submitted_code_length' => strlen($submittedCode),
                'game_type' => $gameType,
            ]);

            // Return score of 0 for evaluation failures
            return [
                'score' => 0,
                'explanation' => 'Unable to evaluate submission. API error occurred.',
                'feedback' => [
                    'correctness' => 'Evaluation failed due to technical issues. Your code looks valid.',
                    'quality' => 'Unable to assess - please try again.',
                    'efficiency' => 'Unable to assess - please try again.',
                    'improvements' => ['Please try submitting again', 'Contact support if this persists'],
                ],
            ];
        }
    }

    /**
     * Build variety context from recent problems
     */
    protected function buildVarietyContext(array $recentProblems): string
    {
        if (empty($recentProblems)) {
            return "\nVARIETY REQUIREMENT: Generate a unique and creative problem. Avoid common textbook examples like FizzBuzz, factorial, palindrome, or sum of two numbers.\n";
        }

        $problemList = implode("\n- ", $recentProblems);

        return <<<CONTEXT

VARIETY REQUIREMENT:
The following problems have been used recently. DO NOT generate similar problems:
- {$problemList}

Generate a COMPLETELY DIFFERENT problem. Be creative and avoid any overlap with the above topics.

CONTEXT;
    }

    /**
     * Build prompt for challenge generation
     */
    protected function buildChallengePrompt(string $language, string $difficulty, string $gameType, string $basePrompt, array $recentProblems = []): string
    {
        $varietyContext = $this->buildVarietyContext($recentProblems);

        // Define difficulty guidelines
        $difficultyGuidelines = match (strtolower($difficulty)) {
            'easy' => 'EASY (BEGINNER LEVEL - CRITICAL): Keep it EXTREMELY SIMPLE! Maximum 10-15 lines of code. Use ONLY basic concepts: simple loops (for/while), basic if/else, print statements, simple variables. Bugs should be OBVIOUS: typos, missing colons/semicolons, = instead of ==, simple off-by-one errors. Think: "first week of programming class". NO advanced concepts, NO recursion, NO complex algorithms. Should be solvable in 2-3 minutes.',
            'medium' => 'MEDIUM: Moderate complexity with 2-3 bugs involving logic errors, edge cases, or common programming mistakes. Should be solvable in 5-10 minutes. Examples: incorrect loop conditions, missing null checks, wrong array indexing, basic algorithm errors.',
            'hard' => 'HARD: Complex bugs involving advanced concepts like recursion, data structures, or subtle logic errors. Should require 10-15 minutes. Examples: stack overflow, memory leaks, race conditions, complex algorithm bugs.',
            default => 'MEDIUM'
        };

        if ($gameType === 'debug') {
            return <<<PROMPT
{$basePrompt}
{$varietyContext}

Requirements:
- Programming Language: {$language}
- Difficulty Level: {$difficulty}
- Challenge Type: Debug Challenge
- Create a buggy code that needs to be fixed. Include 2-3 deliberate bugs.

DIFFICULTY GUIDELINES:
{$difficultyGuidelines}

IMPORTANT: The code should be SHORT and FOCUSED. Keep it under 20 lines. Don't create complex, production-level code.

Provide your response in this EXACT JSON format:
{
    "title": "Challenge title here",
    "description": "Clear description of what the code should do",
    "problem_summary": "Brief 5-10 word summary of the problem (e.g., 'fix array sorting with null values', 'debug recursive factorial function')",
    "buggy_code": "The code with bugs to fix",
    "hints": ["hint1", "hint2"],
    "expected_output": "What the correct output should be"
}

Respond ONLY with valid JSON, no additional text.
PROMPT;
        } else {
            $problemGuidelines = match (strtolower($difficulty)) {
                'easy' => 'EASY (BEGINNER LEVEL - CRITICAL): Keep it EXTREMELY SIMPLE! Use ONLY: basic loops (count from 1-10, iterate array), simple if/else (check even/odd, positive/negative), basic math (+, -, *, /), string length/concatenation, array length/access by index. NO sorting, NO searching algorithms, NO hash maps, NO recursion, NO complex logic. Think: "first month of programming". Examples: sum numbers 1 to N, count vowels in string, find largest in array, check if number is even. Should be solvable in 3-5 minutes with basic programming knowledge.',
                'medium' => 'MEDIUM: Moderate problems requiring basic algorithms or data structure knowledge. Should be solvable in 10-15 minutes. Examples: two-pointer techniques, hash maps, simple recursion, basic sorting/searching. Provide minimal starter code.',
                'hard' => 'HARD: Complex algorithmic problems requiring advanced techniques. Should require 15-20 minutes. Examples: dynamic programming, graph algorithms, complex recursion, advanced data structures. Provide only function signature.',
                default => 'MEDIUM'
            };

            return <<<PROMPT
{$basePrompt}
{$varietyContext}

Requirements:
- Programming Language: {$language}
- Difficulty Level: {$difficulty}
- Challenge Type: Problem Solving
- Create a problem that requires writing code from scratch.

DIFFICULTY GUIDELINES:
{$problemGuidelines}

IMPORTANT: Keep the problem scope REASONABLE. Don't create overly complex problems that would take hours to solve.

STARTER CODE REQUIREMENT:
You MUST provide starter code with an empty function signature to help students get started. The starter code should include:
- Function name that clearly describes what it does
- Correct parameter names and types (if applicable)
- Empty function body (use pass in Python, empty braces in other languages)
- A helpful comment indicating where students should write their code

Examples:
Python: def function_name(param1, param2):\n    # Your code here\n    pass
JavaScript: function functionName(param1, param2) {\n    // Your code here\n}
Java: public returnType functionName(type param1, type param2) {\n    // Your code here\n}

EXAMPLES FORMATTING:
- Input and output should be SIMPLE STRINGS, not nested objects/JSON
- Format complex inputs as readable strings like "array = [1, 2, 3], target = 5"
- Format outputs as simple strings like "[0, 1]" or "true" or "15"
- DO NOT use nested JSON objects in examples - keep them as plain text strings

Provide your response in this EXACT JSON format:
{
    "title": "Challenge title here",
    "description": "Clear problem description",
    "problem_summary": "Brief 5-10 word summary of the problem (e.g., 'find duplicate numbers in array', 'validate email format with regex')",
    "examples": [
        {"input": "nums = [1, 2, 3], target = 5", "output": "[0, 1]"}
    ],
    "constraints": ["constraint1", "constraint2"],
    "starter_code": "Function signature with empty body - REQUIRED"
}

Respond ONLY with valid JSON, no additional text.
PROMPT;
        }
    }

    /**
     * Build prompt for code scoring
     */
    protected function buildScoringPrompt(
        string $question,
        string $submittedCode,
        string $language,
        string $gameType,
        string $basePrompt
    ): string {
        if ($gameType === 'debug') {
            return <<<PROMPT
{$basePrompt}

Original Challenge with Buggy Code:
{$question}

Fixed Code Submitted by Student ({$language}):
{$submittedCode}

Challenge Type: Debug/Bug Fixing

Compare the buggy code with the fixed code and evaluate based on:
1. Bug Fixes (50 points): Did they identify and fix all the bugs correctly?
2. Code Quality (30 points): Is the fixed code clean, readable, and well-structured?
3. Improvements (20 points): Did they add any improvements beyond just fixing bugs?

IMPORTANT: Also provide a SUGGESTED SOLUTION showing the correct, bug-free version of the code. The suggested solution should:
- Fix all the bugs that were present in the original code
- Be clean, well-commented, and follow best practices
- Serve as a learning reference for the student
- Include it inside the feedback object as "suggested_solution"

CRITICAL JSON FORMATTING RULES:
1. The suggested_solution MUST be a single string value with properly escaped newlines (\\n)
2. DO NOT use actual line breaks in the JSON - use \\n instead
3. Escape any quotes inside the code using backslash (\\")
4. The suggested_solution must be inside the feedback object, not at root level
5. Do NOT add any extra fields or keys beyond what's specified

Provide your response in this EXACT JSON format:
{
    "score": 85,
    "explanation": "Brief explanation of the score",
    "feedback": {
        "correctness": "Which bugs were fixed correctly and which were missed",
        "quality": "Feedback on code quality and readability",
        "efficiency": "Any improvements or optimizations made",
        "improvements": ["suggestion1", "suggestion2"],
        "suggested_solution": "for i in range(1, 16):\\n    if i % 3 == 0 and i % 5 == 0:\\n        print('FizzBuzz')\\n    elif i % 5 == 0:\\n        print('Buzz')\\n    elif i % 3 == 0:\\n        print('Fizz')\\n    else:\\n        print(i)"
    }
}

Score must be between 0-100.
Respond ONLY with valid JSON, no additional text or extra fields.
PROMPT;
        } else {
            return <<<PROMPT
{$basePrompt}

Original Challenge:
{$question}

Submitted Solution ({$language}):
{$submittedCode}

Challenge Type: Problem Solving

IMPORTANT VALIDATION:
- Check if the submitted content contains programming constructs (functions, variables, loops, etc.)
- ONLY give a score of 0 if it's clearly NOT code (e.g., plain text like "i give up", "skip", single words, etc.)
- If it contains ANY code-like syntax or programming attempt (even if wrong/incomplete), evaluate it normally
- Be LENIENT - when in doubt, treat it as a code attempt and evaluate fairly

Evaluate this code based on:
1. Correctness (50 points): Does it solve the problem correctly and handle all edge cases?
2. Code Quality (30 points): Is it clean, readable, well-structured, and follows best practices?
3. Efficiency (20 points): Is the algorithm optimized in terms of time and space complexity?

IMPORTANT: Also provide a SUGGESTED SOLUTION that shows an optimal way to solve this problem. The suggested solution should:
- Be clean, well-commented, and follow best practices
- Handle all edge cases
- Use an efficient algorithm
- Serve as a learning reference for the student
- Include it inside the feedback object as "suggested_solution"

CRITICAL JSON FORMATTING RULES:
1. The suggested_solution MUST be a single string value with properly escaped newlines (\\n)
2. DO NOT use actual line breaks in the JSON - use \\n instead
3. Escape any quotes inside the code using backslash (\\")
4. The suggested_solution must be inside the feedback object, not at root level
5. Do NOT add any extra fields or keys beyond what's specified

Provide your response in this EXACT JSON format (copy this structure precisely):
{
    "score": 85,
    "explanation": "Brief explanation of the score",
    "feedback": {
        "correctness": "Detailed feedback on correctness and edge case handling",
        "quality": "Feedback on code quality, readability, and best practices",
        "efficiency": "Feedback on algorithm efficiency and optimizations",
        "improvements": ["suggestion1", "suggestion2"],
        "suggested_solution": "def function_name(params):\\n    # Comment here\\n    return result"
    }
}

Example of CORRECT suggested_solution format:
"suggested_solution": "def sum_even(numbers):\\n    total = 0\\n    for num in numbers:\\n        if num % 2 == 0:\\n            total += num\\n    return total"

Score must be between 0-100. Give 0 if submission is not actual code.
Respond ONLY with valid JSON, no additional text or extra fields.
PROMPT;
        }
    }

    /**
     * Make API request to Groq
     */
    protected function makeRequest(string $prompt): string
    {
        Log::info('Groq API Request', ['prompt_length' => strlen($prompt)]);

        $response = Http::timeout(30)
            ->withOptions(['verify' => false]) // Disable SSL verification for development
            ->withHeaders([
                'Authorization' => 'Bearer '.$this->apiKey,
                'Content-Type' => 'application/json',
            ])
            ->post($this->baseUrl, [
                'model' => $this->model,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ],
                'temperature' => 0.7,
                'max_tokens' => 8192,
                'response_format' => ['type' => 'json_object'],
            ]);

        Log::info('Groq API Response', [
            'status' => $response->status(),
            'successful' => $response->successful(),
            'body_length' => strlen($response->body()),
        ]);

        if (! $response->successful()) {
            Log::error('Groq API Error', ['body' => $response->body()]);
            throw new \Exception('Groq API request failed: '.$response->body());
        }

        $data = $response->json();

        if (! isset($data['choices'][0]['message']['content'])) {
            Log::error('Invalid Groq Response Format', ['data' => $data]);
            throw new \Exception('Invalid response format from Groq API');
        }

        $result = $data['choices'][0]['message']['content'];
        Log::info('Groq Response Text', ['text' => substr($result, 0, 200)]);

        return $result;
    }

    /**
     * Parse challenge generation response
     */
    protected function parseChallengeResponse(string $response, string $gameType): array
    {
        Log::info('Parsing challenge response', ['length' => strlen($response), 'first_100' => substr($response, 0, 100)]);

        // With response_format json_object, we should get clean JSON
        $response = trim($response);

        $data = json_decode($response, true);

        if (! $data) {
            Log::error('JSON decode failed', [
                'json_error' => json_last_error_msg(),
                'response_length' => strlen($response),
                'full_response' => substr($response, 0, 1000),
            ]);
            throw new \Exception('Failed to parse JSON response: '.json_last_error_msg());
        }

        Log::info('Challenge parsed successfully', ['data_keys' => array_keys($data)]);

        return $data;
    }

    /**
     * Parse scoring response
     */
    protected function parseScoringResponse(string $response): array
    {
        Log::info('Parsing scoring response', ['length' => strlen($response), 'first_100' => substr($response, 0, 100)]);

        // Clean and normalize the response
        $response = $this->cleanJsonResponse($response);

        $data = json_decode($response, true);

        if (! $data || ! isset($data['score'])) {
            Log::error('Scoring JSON decode failed', [
                'json_error' => json_last_error_msg(),
                'response_length' => strlen($response),
                'full_response' => substr($response, 0, 1000),
            ]);
            throw new \Exception('Failed to parse scoring response: '.json_last_error_msg());
        }

        // Clean up any malformed suggested_solution in feedback
        if (isset($data['feedback']) && is_array($data['feedback'])) {
            $data['feedback'] = $this->cleanFeedbackObject($data['feedback']);
        }

        // Ensure score is within bounds
        $data['score'] = max(0, min(100, (int) $data['score']));

        Log::info('Scoring parsed successfully', [
            'score' => $data['score'],
            'has_suggested_solution' => isset($data['feedback']['suggested_solution']),
            'response_keys' => array_keys($data),
        ]);

        return $data;
    }

    /**
     * Clean JSON response to handle malformed output
     */
    protected function cleanJsonResponse(string $response): string
    {
        // Trim whitespace
        $response = trim($response);

        // Remove any markdown code blocks if present
        $response = preg_replace('/^```json\s*/i', '', $response);
        $response = preg_replace('/\s*```$/', '', $response);

        return trim($response);
    }

    /**
     * Clean feedback object to remove malformed keys
     */
    protected function cleanFeedbackObject(array $feedback): array
    {
        // Get only valid feedback keys
        $validKeys = ['correctness', 'quality', 'efficiency', 'improvements', 'suggested_solution'];
        $cleanedFeedback = [];

        foreach ($feedback as $key => $value) {
            // If key contains newlines or code, it's likely malformed
            if (strpos($key, "\n") !== false || strlen($key) > 100) {
                // This is likely a malformed key with code in it
                // Try to extract the suggested_solution value from it
                if (! isset($cleanedFeedback['suggested_solution']) && is_string($key)) {
                    // The key itself might be the code, use it as suggested_solution
                    $cleanedFeedback['suggested_solution'] = trim($key);
                }

                continue;
            }

            // Keep only valid keys
            if (in_array($key, $validKeys)) {
                $cleanedFeedback[$key] = $value;
            }
        }

        // Ensure suggested_solution exists (for both debug and problem-solving)
        if (! isset($cleanedFeedback['suggested_solution'])) {
            $cleanedFeedback['suggested_solution'] = 'No suggested solution provided.';
        }

        // Ensure improvements is an array
        if (isset($cleanedFeedback['improvements']) && ! is_array($cleanedFeedback['improvements'])) {
            $cleanedFeedback['improvements'] = [$cleanedFeedback['improvements']];
        }

        return $cleanedFeedback;
    }

    /**
     * Fallback challenge when API fails
     */
    protected function getFallbackChallenge(string $language, string $difficulty, string $gameType): array
    {
        if ($gameType === 'debug') {
            return [
                'title' => 'Fix the FizzBuzz',
                'description' => 'The following FizzBuzz implementation has bugs. Fix them to make it work correctly.',
                'buggy_code' => $this->getFallbackBuggyCode($language),
                'hints' => [
                    'Check the conditions carefully',
                    'Look at the order of the if statements',
                ],
                'expected_output' => '1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz',
            ];
        } else {
            return [
                'title' => 'Sum of Two Numbers',
                'description' => 'Write a function that returns the sum of two numbers.',
                'examples' => [
                    ['input' => 'a = 5, b = 3', 'output' => '8'],
                    ['input' => 'a = -2, b = 7', 'output' => '5'],
                ],
                'constraints' => ['Numbers can be negative', 'Return an integer'],
                'starter_code' => $this->getFallbackStarterCode($language),
            ];
        }
    }

    protected function getFallbackBuggyCode(string $language): string
    {
        return match (strtolower($language)) {
            'python' => 'for i in range(1, 16):\n    if i % 3 = 0 and i % 5 == 0:\n        print("FizzBuzz")\n    elif i % 5 == 0:\n        print("Buzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    else:\n        print(i)',
            'javascript' => 'for (let i = 1; i <= 15; i++) {\n    if (i % 3 === 0 && i % 5 = 0) {\n        console.log("FizzBuzz");\n    } else if (i % 5 === 0) {\n        console.log("Buzz");\n    } else if (i % 3 === 0) {\n        console.log("Fizz");\n    } else {\n        console.log(i);\n    }\n}',
            default => '// FizzBuzz with bugs\nfor (int i = 1; i <= 15; i++) {\n    if (i % 3 == 0 && i % 5 = 0) {\n        print("FizzBuzz");\n    }\n}'
        };
    }

    protected function getFallbackStarterCode(string $language): string
    {
        return match (strtolower($language)) {
            'python' => 'def sum_numbers(a, b):\n    # Your code here\n    pass',
            'javascript' => 'function sumNumbers(a, b) {\n    // Your code here\n}',
            'java' => 'public int sumNumbers(int a, int b) {\n    // Your code here\n}',
            default => 'function sum(a, b) {\n    // Your code here\n}'
        };
    }
}
