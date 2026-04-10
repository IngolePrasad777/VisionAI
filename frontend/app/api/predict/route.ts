import { NextResponse } from 'next/server'

const SPRING_URL = process.env.SPRING_API_URL || 'http://localhost:8081'

interface Answer {
  plate_id: string   // plateNumber as string e.g. "1"
  user_answer: string
}

// Map plate numbers to categories (matches DataSeeder)
function getCategory(plateNum: number): 'control' | 'red' | 'green' | 'vanishing' {
  if (plateNum >= 1  && plateNum <= 12) return 'green'
  if (plateNum >= 13 && plateNum <= 22) return 'red'
  if (plateNum >= 23 && plateNum <= 26) return 'control'
  return 'vanishing'
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const answers: Answer[] = body.answers

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    // Compute the 6 features from user answers
    let controlFail = 0, redFail = 0, greenFail = 0, vanishingSeen = 0
    let totalCorrect = 0
    const totalSeen = answers.length

    answers.forEach(({ plate_id, user_answer }) => {
      const plateNum = parseInt(plate_id)
      const category = getCategory(plateNum)
      const answered = user_answer.trim() !== '' && user_answer.trim() !== '0'

      if (answered) totalCorrect++

      if (category === 'control'   && !answered) controlFail++
      if (category === 'red'       && !answered) redFail++
      if (category === 'green'     && !answered) greenFail++
      if (category === 'vanishing' &&  answered) vanishingSeen++
    })

    // Get JWT from request header (forwarded from client)
    const authHeader = request.headers.get('Authorization')

    const springRes = await fetch(`${SPRING_URL}/api/test/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify({ controlFail, redFail, greenFail, vanishingSeen, totalCorrect, totalSeen }),
    })

    if (!springRes.ok) {
      const err = await springRes.json().catch(() => ({}))
      return NextResponse.json(
        { error: err.error || 'Prediction failed' },
        { status: springRes.status }
      )
    }

    const session = await springRes.json()

    // Map Spring Boot TestSession → frontend PredictionResult
    return NextResponse.json({
      prediction: session.prediction,
      confidence: session.confidence / 100,   // Spring returns 0-100, frontend expects 0-1
      explanation: buildExplanation(session.prediction, session.confidence, session.scores),
    })

  } catch (err) {
    console.error('Predict route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function buildExplanation(
  prediction: string,
  confidence: number,
  scores: Record<string, number>
): string {
  const explanations: Record<string, string> = {
    Normal:
      'Your responses indicate normal color vision. You correctly identified patterns across all Ishihara plate categories, including red-dominant, green-dominant, control, and vanishing plates.',
    Protanopia:
      'Your responses show a pattern consistent with Protanopia (red-blind deficiency). You had difficulty with red-dominant plates, suggesting reduced sensitivity to red light wavelengths. This affects approximately 1% of males.',
    Deuteranopia:
      'Your responses are consistent with Deuteranopia (green-blind deficiency). You made errors primarily on green-dominant plates, indicating reduced sensitivity to green light wavelengths. This is the most common form of CVD, affecting ~6% of males.',
    RG_Deficient:
      'Your responses indicate a Red-Green color vision deficiency. You showed difficulty across both red and green plate categories, suggesting a combined deficiency in red-green color discrimination.',
  }
  return explanations[prediction] || 'Analysis complete. Please consult an eye care professional for a comprehensive evaluation.'
}
