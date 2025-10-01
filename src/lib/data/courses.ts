import { Course } from '@/types/learning';

export const promptEngineeringAwarenessCourse: Course = {
  id: 'prompt-engineering-awareness',
  title: 'Prompt Engineering Awareness',
  summary: 'Master the human-centric skills required to brief large language models with clarity, context, and control.',
  difficulty: 'beginner',
  heroImage: '/images/course/prompt-awareness.png',
  estimatedHours: 4,
  tags: ['prompting', 'communication', 'llm', 'foundations'],
  prerequisites: ['Basic familiarity with ChatGPT or another LLM experience.'],
  certificationCriteria: {
    minLessonsCompletedRatio: 0.8,
    minQuizAverage: 0.7,
  },
  lessons: [
    {
      id: 'lesson-01-human-to-model-bridge',
      courseId: 'prompt-engineering-awareness',
      order: 1,
      title: 'Think Like a Dialogue Architect',
      estimatedMinutes: 35,
      outcomes: [
        'Explain why LLMs need explicit framing about goals and audiences.',
        'Structure prompts with role, objective, and constraints to set expectations.',
        'Spot vague language that produces unstable outputs.'
      ],
      slides: [
        {
          id: 'slide-01-role-objective-context',
          type: 'concept',
          title: 'Role -> Objective -> Context',
          content: 'Every successful prompt orients the model with three anchors: **role** (who should the model be), **objective** (what outcome you need), and **context** (what inputs, audience, or constraints apply). Treat it like briefing a colleague on day one.'
        },
        {
          id: 'slide-02-human-analogy',
          type: 'concept',
          title: 'Humans Default to Shared Reality-LLMs Do Not',
          content: 'When we talk to coworkers, we rely on shared projects and history. LLMs have pattern memory but no situational awareness. Being explicit about the desired voice, audience, or format removes latent ambiguity that leads to hallucinations.'
        },
        {
          id: 'slide-03-structured-template',
          type: 'demo',
          title: 'Baseline Brief Template',
          content: 'Prompt blueprint:\n1. **Role** - “You are a senior UX writer.”\n2. **Objective** - “Draft onboarding copy for our budgeting app.”\n3. **Inputs** - “Use the feature bullets below…”.\n4. **Output format** - “Return as a 3-part onboarding flow with CTA.”',
          promptExample: 'You are a senior UX writer for a budgeting app…'
        },
        {
          id: 'slide-04-quick-spot-check',
          type: 'exercise',
          title: 'Spot the Missing Context',
          content: 'Rewrite this vague prompt into the four-part brief template. Original: “Write about money habits.” Replace with a role, objective, inputs, and output format in under 80 words.',
          expectedOutcome: 'Learner highlights audience, tone, and formatting instructions.'
        },
        {
          id: 'slide-05-quiz',
          type: 'quiz',
          title: 'Knowledge Check',
          question: 'Which element most reduces hallucinations when briefing an LLM?',
          content: 'Choose the best answer.',
          options: [
            { id: 'a', label: 'Asking the model to think step-by-step', isCorrect: false, explanation: 'Useful for reasoning, but without context the model still guesses.' },
            { id: 'b', label: 'Providing concrete audience and input context', isCorrect: true, explanation: 'Context grounds the response in real data instead of guesses.' },
            { id: 'c', label: 'Setting temperature to 0', isCorrect: false, explanation: 'Lower temperature narrows randomness but does not supply missing facts.' },
            { id: 'd', label: 'Repeating the prompt twice', isCorrect: false, explanation: 'Repetition does not add new information.' }
          ],
          rationale: 'Explicit context is the fastest path to predictable outputs.'
        }
      ],
      quiz: {
        id: 'lesson-01-quiz',
        type: 'quiz',
        title: 'Lesson 1 Quiz',
        question: 'What should every high-performing prompt include?',
        content: 'Select the option that captures the minimum briefing structure.',
        options: [
          { id: 'a', label: 'A catchy opening and closing line', isCorrect: false, explanation: 'Style matters, but without goals and constraints you still get random responses.' },
          { id: 'b', label: 'Role, objective, inputs/context, and output format', isCorrect: true, explanation: 'These four anchors tell the model what to do, with what information, and how to package the result.' },
          { id: 'c', label: 'A temperature setting and max tokens', isCorrect: false, explanation: 'Tuning parameters help polish results after the core brief is strong.' },
          { id: 'd', label: 'The phrase “no hallucinations”', isCorrect: false, explanation: 'Negative instructions lack actionable guidance.' }
        ],
        rationale: 'The four-part brief consistently improves clarity and reduces retries.'
      }
    },
    {
      id: 'lesson-02-evidence-first-prompts',
      courseId: 'prompt-engineering-awareness',
      order: 2,
      title: 'Ground the Model in Evidence',
      estimatedMinutes: 40,
      outcomes: [
        'Chunk source material so the model can quote and reference accurately.',
        'Calibrate instructions for retrieval-augmented generation (RAG).',
        'Compose critique prompts that evaluate bias, coverage, and tone.'
      ],
      slides: [
        {
          id: 'slide-06-context-windows',
          type: 'concept',
          title: 'Context Windows Are Finite',
          content: 'Most frontier models handle 8K–200K tokens. Overloading the window reduces accuracy. Feed only the paragraphs, tables, or bullet summaries that the answer truly requires.'
        },
        {
          id: 'slide-07-snippets',
          type: 'demo',
          title: 'Evidence Blocks',
          content: 'Wrap each source snippet in a short label: ```[Source A - Annual Report] …``` Then in the prompt ask the model to cite the label. This mirrors how analysts provide references to teammates.'
        },
        {
          id: 'slide-08-critique-chain',
          type: 'concept',
          title: 'Critique Before You Revise',
          content: 'When optimizing a prompt, ask the model to critique the draft first. Signals like coverage gaps or missing constraints guide a second-pass rewrite that is traceable.'
        },
        {
          id: 'slide-09-practice',
          type: 'exercise',
          title: 'Build a Retrieval Prompt',
          content: 'You have three policy excerpts about customer refunds. Draft a prompt that instructs the assistant to cite the specific excerpt when answering a complaint email.',
          expectedOutcome: 'Learner specifies snippet labels, citation style, and refusal policy.'
        },
        {
          id: 'slide-10-quiz',
          type: 'quiz',
          title: 'Knowledge Check',
          question: 'Why do we ask the model to cite snippet labels in RAG workflows?',
          content: 'Pick the best explanation.',
          options: [
            { id: 'a', label: 'It saves tokens by shortening the answer.', isCorrect: false, explanation: 'Citations add a few tokens but earn trust.' },
            { id: 'b', label: 'It helps trace outputs back to evidence for human verification.', isCorrect: true, explanation: 'Citations make it clear which document supported the claim.' },
            { id: 'c', label: 'It lowers API latency.', isCorrect: false, explanation: 'Latency depends on model and request size.' },
            { id: 'd', label: 'It increases the temperature automatically.', isCorrect: false, explanation: 'Temperature is unrelated to citations.' }
          ],
          rationale: 'Traceability keeps humans in the loop and builds trust.'
        }
      ],
      quiz: {
        id: 'lesson-02-quiz',
        type: 'quiz',
        title: 'Lesson 2 Quiz',
        question: 'What is the safest order of operations when refining a prompt with an LLM assistant?',
        content: 'Choose the workflow that yields explainable improvements.',
        options: [
          { id: 'a', label: 'Revise the prompt, run it, then skim the output.', isCorrect: false, explanation: 'Skipping critique hides problems until the end.' },
          { id: 'b', label: 'Critique the prompt, adjust with evidence, then request a rewrite.', isCorrect: true, explanation: 'Critique supplies a checklist for the rewrite and invites citations.' },
          { id: 'c', label: 'Run random variations until the output looks correct.', isCorrect: false, explanation: 'Trial and error wastes tokens and time.' },
          { id: 'd', label: 'Let the model guess what evidence to include.', isCorrect: false, explanation: 'The model cannot guess which documents you trust.' }
        ],
        rationale: 'A deliberate critique -> revise loop makes improvements measurable.'
      }
    },
    {
      id: 'lesson-03-governance',
      courseId: 'prompt-engineering-awareness',
      order: 3,
      title: 'Establish Guardrails and Feedback Loops',
      estimatedMinutes: 30,
      outcomes: [
        'Define red-team checks for safety, bias, and compliance.',
        'Instrument prompts with success metrics and feedback captures.',
        'Design a certification checkpoint tied to business KPIs.'
      ],
      slides: [
        {
          id: 'slide-11-guardrails',
          type: 'concept',
          title: 'Set the Guardrails in the Prompt',
          content: 'List unacceptable actions up front (e.g., “Never produce legal advice”). Pair negative instructions with positive alternatives (“Instead, route the request to…”).' 
        },
        {
          id: 'slide-12-feedback',
          type: 'demo',
          title: 'Inline Feedback Hooks',
          content: 'Add a closing instruction: “Ask the user if the answer met their needs (yes/no). If no, collect missing detail.” This captures PQS data for the analytics pipeline.'
        },
        {
          id: 'slide-13-pqs-metric',
          type: 'concept',
          title: 'Measure Prompt Quality Score (PQS)',
          content: 'Compute PQS as the median delta between pre-optimization and post-optimization evaluations. Track it per prompt family so teams know when training is working.'
        },
        {
          id: 'slide-14-ritual',
          type: 'exercise',
          title: 'Build a Prompt Retrospective Ritual',
          content: 'Write a one-page policy for your team covering: review cadence, metrics captured (WAL, PQS, CCR, VC), and who reviews flagged prompts each week.',
          expectedOutcome: 'Learner drafts a governance doc focusing on accountability.'
        },
        {
          id: 'slide-15-quiz',
          type: 'quiz',
          title: 'Knowledge Check',
          question: 'Which statement best links prompt governance to business KPIs?',
          content: 'Select the strongest alignment.',
          options: [
            { id: 'a', label: '“Governance keeps prompts tidy.”', isCorrect: false, explanation: 'Too vague; does not tie to measurable outcomes.' },
            { id: 'b', label: '“Connecting WAL, PQS, CCR, and VC to prompt reviews shows leadership how quality drives growth.”', isCorrect: true, explanation: 'This statement ties program rituals to the north-star metrics.' },
            { id: 'c', label: '“Governance eliminates human reviews.”', isCorrect: false, explanation: 'Human oversight remains essential.' },
            { id: 'd', label: '“Metrics distract from creativity.”', isCorrect: false, explanation: 'Data ensures creativity delivers business value.' }
          ],
          rationale: 'Stakeholders fund programs anchored to metrics that matter.'
        }
      ],
      quiz: {
        id: 'lesson-03-quiz',
        type: 'quiz',
        title: 'Lesson 3 Quiz',
        question: 'What do you need before issuing a Prompt Temple certificate?',
        content: 'Pick the requirement that satisfies the certification criteria.',
        options: [
          { id: 'a', label: 'Complete any one lesson with a perfect score.', isCorrect: false, explanation: 'Certification requires broad coverage, not a single lesson.' },
          { id: 'b', label: 'Complete at least 80% of lessons and maintain a 70% quiz average.', isCorrect: true, explanation: 'This matches the course certification policy.' },
          { id: 'c', label: 'Invite three teammates.', isCorrect: false, explanation: 'Referrals are encouraged but not mandatory for certification.' },
          { id: 'd', label: 'Submit a prompt marketplace listing.', isCorrect: false, explanation: 'Marketplace contributions happen after certification.' }
        ],
        rationale: 'Certification verifies sustained practice tied to learning outcomes.'
      }
    }
  ]
};

export const courses: Course[] = [promptEngineeringAwarenessCourse];




