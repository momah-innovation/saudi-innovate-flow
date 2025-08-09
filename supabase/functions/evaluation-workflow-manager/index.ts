import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EvaluationWorkflowRequest {
  action: string;
  ideaId?: string;
  evaluatorId?: string;
  data?: any;
  evaluationData?: {
    technical_feasibility: number;
    financial_viability: number;
    market_potential: number;
    strategic_alignment: number;
    innovation_level: number;
    overall_score?: number;
    comments?: string;
    recommendations?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, ideaId, evaluatorId, data, evaluationData }: EvaluationWorkflowRequest = await req.json();

    console.log('Evaluation workflow action:', { action, ideaId, evaluatorId });

    let result: any = {};

    switch (action) {
      case 'submit_evaluation':
        result = await submitEvaluation(supabaseClient, ideaId!, evaluatorId!, evaluationData!);
        break;
      
      case 'assign_evaluator':
        result = await assignEvaluator(supabaseClient, ideaId!, evaluatorId!, data);
        break;
      
      case 'get_evaluation_status':
        result = await getEvaluationStatus(supabaseClient, ideaId!);
        break;
      
      case 'finalize_evaluation':
        result = await finalizeEvaluation(supabaseClient, ideaId!, data);
        break;
      
      case 'bulk_assign_evaluations':
        result = await bulkAssignEvaluations(supabaseClient, data.ideaIds, data.evaluatorIds);
        break;
      
      case 'generate_evaluation_report':
        result = await generateEvaluationReport(supabaseClient, ideaId!);
        break;
      
      case 'ai_assisted_evaluation':
        result = await aiAssistedEvaluation(supabaseClient, ideaId!, data);
        break;
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: result 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in evaluation-workflow-manager:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

async function submitEvaluation(supabase: any, ideaId: string, evaluatorId: string, evaluationData: any) {
  // Check if evaluator already submitted evaluation
  const { data: existing, error: checkError } = await supabase
    .from('idea_evaluations')
    .select('id')
    .eq('idea_id', ideaId)
    .eq('evaluator_id', evaluatorId)
    .maybeSingle();

  if (checkError) throw checkError;

  if (existing) {
    // Update existing evaluation
    const { data: evaluation, error: updateError } = await supabase
      .from('idea_evaluations')
      .update({
        ...evaluationData,
        overall_score: calculateOverallScore(evaluationData),
        updated_at: new Date().toISOString(),
        evaluation_date: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (updateError) throw updateError;

    await notifyEvaluationUpdate(supabase, ideaId, 'updated');
    return { evaluationId: evaluation.id, action: 'updated' };
  } else {
    // Create new evaluation
    const { data: evaluation, error: insertError } = await supabase
      .from('idea_evaluations')
      .insert({
        idea_id: ideaId,
        evaluator_id: evaluatorId,
        ...evaluationData,
        overall_score: calculateOverallScore(evaluationData),
        evaluation_date: new Date().toISOString(),
        status: 'completed'
      })
      .select()
      .single();

    if (insertError) throw insertError;

    await notifyEvaluationUpdate(supabase, ideaId, 'submitted');
    await checkIfAllEvaluationsComplete(supabase, ideaId);
    
    return { evaluationId: evaluation.id, action: 'created' };
  }
}

async function assignEvaluator(supabase: any, ideaId: string, evaluatorId: string, data?: any) {
  // Create evaluation assignment
  const { data: assignment, error: assignError } = await supabase
    .from('idea_evaluation_assignments')
    .insert({
      idea_id: ideaId,
      evaluator_id: evaluatorId,
      assigned_by: data?.assignedBy,
      due_date: data?.dueDate ? new Date(data.dueDate).toISOString() : null,
      priority: data?.priority || 'medium',
      evaluation_criteria: data?.criteria || ['technical_feasibility', 'financial_viability', 'market_potential', 'strategic_alignment', 'innovation_level'],
      status: 'pending'
    })
    .select()
    .single();

  if (assignError) throw assignError;

  // Send notification to evaluator
  await notifyEvaluatorAssignment(supabase, ideaId, evaluatorId);

  // Log analytics
  await supabase
    .from('analytics_events')
    .insert({
      event_type: 'evaluator_assigned',
      event_category: 'evaluation',
      entity_type: 'idea',
      entity_id: ideaId,
      properties: { evaluator_id: evaluatorId, assignment_id: assignment.id }
    });

  return {
    assignmentId: assignment.id,
    message: 'Evaluator assigned successfully'
  };
}

async function getEvaluationStatus(supabase: any, ideaId: string) {
  // Get all evaluations for the idea
  const { data: evaluations, error: evalError } = await supabase
    .from('idea_evaluations')
    .select(`
      *,
      profiles(display_name, profile_image_url)
    `)
    .eq('idea_id', ideaId);

  if (evalError) throw evalError;

  // Get assignments
  const { data: assignments, error: assignError } = await supabase
    .from('idea_evaluation_assignments')
    .select(`
      *,
      profiles(display_name, profile_image_url)
    `)
    .eq('idea_id', ideaId);

  if (assignError) throw assignError;

  // Calculate aggregated scores
  const aggregatedScores = calculateAggregatedScores(evaluations || []);

  return {
    evaluations: evaluations || [],
    assignments: assignments || [],
    aggregatedScores,
    totalEvaluators: assignments?.length || 0,
    completedEvaluations: evaluations?.length || 0,
    evaluationProgress: assignments?.length > 0 ? Math.round(((evaluations?.length || 0) / assignments.length) * 100) : 0
  };
}

async function finalizeEvaluation(supabase: any, ideaId: string, data: any) {
  // Calculate final scores and decision
  const { data: evaluations, error: evalError } = await supabase
    .from('idea_evaluations')
    .select('*')
    .eq('idea_id', ideaId);

  if (evalError) throw evalError;

  if (!evaluations || evaluations.length === 0) {
    throw new Error('No evaluations found for this idea');
  }

  const finalScores = calculateAggregatedScores(evaluations);
  const decision = determineDecision(finalScores.averageOverallScore, data.threshold || 70);

  // Update idea with final evaluation results
  const { error: updateError } = await supabase
    .from('ideas')
    .update({
      evaluation_status: 'completed',
      final_evaluation_score: finalScores.averageOverallScore,
      evaluation_decision: decision,
      evaluation_completed_at: new Date().toISOString()
    })
    .eq('id', ideaId);

  if (updateError) throw updateError;

  // Create evaluation summary
  const { data: summary, error: summaryError } = await supabase
    .from('idea_evaluation_summaries')
    .insert({
      idea_id: ideaId,
      final_scores: finalScores,
      decision,
      total_evaluators: evaluations.length,
      evaluation_criteria_met: finalScores.averageOverallScore >= (data.threshold || 70),
      summary_generated_at: new Date().toISOString(),
      generated_by: data.finalizedBy
    })
    .select()
    .single();

  if (summaryError) throw summaryError;

  // Send final evaluation notification
  await notifyEvaluationFinalized(supabase, ideaId, decision, finalScores.averageOverallScore);

  return {
    summaryId: summary.id,
    finalScores,
    decision,
    message: 'Evaluation finalized successfully'
  };
}

async function bulkAssignEvaluations(supabase: any, ideaIds: string[], evaluatorIds: string[]) {
  const results = [];

  for (const ideaId of ideaIds) {
    for (const evaluatorId of evaluatorIds) {
      try {
        const result = await assignEvaluator(supabase, ideaId, evaluatorId);
        results.push({ ideaId, evaluatorId, success: true, result });
      } catch (error) {
        results.push({ ideaId, evaluatorId, success: false, error: error.message });
      }
    }
  }

  return {
    totalAssignments: ideaIds.length * evaluatorIds.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  };
}

async function generateEvaluationReport(supabase: any, ideaId: string) {
  // Get idea details
  const { data: idea, error: ideaError } = await supabase
    .from('ideas')
    .select('*')
    .eq('id', ideaId)
    .single();

  if (ideaError) throw ideaError;

  // Get all evaluations
  const { data: evaluations, error: evalError } = await supabase
    .from('idea_evaluations')
    .select(`
      *,
      profiles(display_name, profile_image_url)
    `)
    .eq('idea_id', ideaId);

  if (evalError) throw evalError;

  // Generate comprehensive report
  const report = {
    idea: {
      id: idea.id,
      title: idea.title_ar,
      description: idea.description_ar,
      status: idea.status,
      submittedBy: idea.innovator_id
    },
    evaluationSummary: calculateAggregatedScores(evaluations || []),
    individualEvaluations: evaluations || [],
    recommendations: generateRecommendations(evaluations || []),
    nextSteps: determineNextSteps(idea.status, evaluations || []),
    generatedAt: new Date().toISOString()
  };

  return report;
}

async function aiAssistedEvaluation(supabase: any, ideaId: string, data: any) {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    throw new Error('AI evaluation not available - OpenAI API key not configured');
  }

  // Get idea details
  const { data: idea, error: ideaError } = await supabase
    .from('ideas')
    .select('title_ar, description_ar, solution_approach, implementation_plan')
    .eq('id', ideaId)
    .single();

  if (ideaError) throw ideaError;

  // Create AI evaluation prompt
  const prompt = `
    Evaluate this innovation idea on a scale of 1-10 for each criterion:
    
    Idea Title: ${idea.title_ar}
    Description: ${idea.description_ar}
    Solution Approach: ${idea.solution_approach || 'Not provided'}
    Implementation Plan: ${idea.implementation_plan || 'Not provided'}
    
    Please provide scores for:
    1. Technical Feasibility (1-10)
    2. Financial Viability (1-10)
    3. Market Potential (1-10)
    4. Strategic Alignment (1-10)
    5. Innovation Level (1-10)
    
    Also provide:
    - Overall assessment
    - Key strengths
    - Areas for improvement
    - Recommendations
    
    Respond in JSON format with the structure:
    {
      "technical_feasibility": number,
      "financial_viability": number,
      "market_potential": number,
      "strategic_alignment": number,
      "innovation_level": number,
      "overall_assessment": "string",
      "strengths": ["string"],
      "improvements": ["string"],
      "recommendations": ["string"]
    }
  `;

  // Call OpenAI API
  const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert innovation evaluator. Provide objective, constructive evaluations of innovation ideas.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    }),
  });

  if (!openaiResponse.ok) {
    throw new Error(`OpenAI API error: ${openaiResponse.statusText}`);
  }

  const openaiResult = await openaiResponse.json();
  const aiEvaluation = JSON.parse(openaiResult.choices[0]?.message?.content?.trim() || '{}');

  // Save AI evaluation
  const { data: evaluation, error: evalError } = await supabase
    .from('idea_evaluations')
    .insert({
      idea_id: ideaId,
      evaluator_id: null, // AI evaluation
      evaluator_type: 'ai_assistant',
      technical_feasibility: aiEvaluation.technical_feasibility,
      financial_viability: aiEvaluation.financial_viability,
      market_potential: aiEvaluation.market_potential,
      strategic_alignment: aiEvaluation.strategic_alignment,
      innovation_level: aiEvaluation.innovation_level,
      overall_score: Math.round((aiEvaluation.technical_feasibility + aiEvaluation.financial_viability + aiEvaluation.market_potential + aiEvaluation.strategic_alignment + aiEvaluation.innovation_level) / 5),
      comments: aiEvaluation.overall_assessment,
      recommendations: aiEvaluation.recommendations.join('\n'),
      evaluation_date: new Date().toISOString(),
      status: 'completed',
      metadata: {
        ai_generated: true,
        strengths: aiEvaluation.strengths,
        improvements: aiEvaluation.improvements
      }
    })
    .select()
    .single();

  if (evalError) throw evalError;

  return {
    evaluationId: evaluation.id,
    aiEvaluation,
    message: 'AI evaluation completed successfully'
  };
}

// Helper functions
function calculateOverallScore(evaluationData: any): number {
  const scores = [
    evaluationData.technical_feasibility,
    evaluationData.financial_viability,
    evaluationData.market_potential,
    evaluationData.strategic_alignment,
    evaluationData.innovation_level
  ].filter(score => score !== null && score !== undefined);

  return scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
}

function calculateAggregatedScores(evaluations: any[]) {
  if (evaluations.length === 0) {
    return {
      averageOverallScore: 0,
      averageTechnicalFeasibility: 0,
      averageFinancialViability: 0,
      averageMarketPotential: 0,
      averageStrategicAlignment: 0,
      averageInnovationLevel: 0,
      evaluationCount: 0
    };
  }

  const totals = evaluations.reduce((acc, eval) => {
    acc.overall_score += eval.overall_score || 0;
    acc.technical_feasibility += eval.technical_feasibility || 0;
    acc.financial_viability += eval.financial_viability || 0;
    acc.market_potential += eval.market_potential || 0;
    acc.strategic_alignment += eval.strategic_alignment || 0;
    acc.innovation_level += eval.innovation_level || 0;
    return acc;
  }, {
    overall_score: 0,
    technical_feasibility: 0,
    financial_viability: 0,
    market_potential: 0,
    strategic_alignment: 0,
    innovation_level: 0
  });

  const count = evaluations.length;

  return {
    averageOverallScore: Math.round(totals.overall_score / count),
    averageTechnicalFeasibility: Math.round(totals.technical_feasibility / count),
    averageFinancialViability: Math.round(totals.financial_viability / count),
    averageMarketPotential: Math.round(totals.market_potential / count),
    averageStrategicAlignment: Math.round(totals.strategic_alignment / count),
    averageInnovationLevel: Math.round(totals.innovation_level / count),
    evaluationCount: count
  };
}

function determineDecision(averageScore: number, threshold: number): string {
  if (averageScore >= threshold) {
    return 'approved';
  } else if (averageScore >= threshold - 20) {
    return 'conditional';
  } else {
    return 'rejected';
  }
}

function generateRecommendations(evaluations: any[]): string[] {
  // Extract common recommendations from evaluations
  const recommendations = new Set<string>();
  
  evaluations.forEach(eval => {
    if (eval.recommendations) {
      eval.recommendations.split('\n').forEach((rec: string) => {
        if (rec.trim()) {
          recommendations.add(rec.trim());
        }
      });
    }
  });

  return Array.from(recommendations);
}

function determineNextSteps(currentStatus: string, evaluations: any[]): string[] {
  const averageScore = evaluations.length > 0 
    ? evaluations.reduce((sum, eval) => sum + (eval.overall_score || 0), 0) / evaluations.length 
    : 0;

  if (averageScore >= 70) {
    return [
      'Proceed to implementation planning',
      'Assign project team',
      'Develop detailed timeline',
      'Secure necessary resources'
    ];
  } else if (averageScore >= 50) {
    return [
      'Address evaluator concerns',
      'Revise implementation approach',
      'Seek additional expert input',
      'Resubmit for evaluation'
    ];
  } else {
    return [
      'Significant improvements needed',
      'Consider fundamental changes to concept',
      'Seek mentorship or guidance',
      'May require major revision'
    ];
  }
}

async function notifyEvaluationUpdate(supabase: any, ideaId: string, action: string) {
  // Implementation for evaluation update notifications
}

async function notifyEvaluatorAssignment(supabase: any, ideaId: string, evaluatorId: string) {
  // Implementation for evaluator assignment notifications
}

async function notifyEvaluationFinalized(supabase: any, ideaId: string, decision: string, score: number) {
  // Implementation for evaluation finalization notifications
}

async function checkIfAllEvaluationsComplete(supabase: any, ideaId: string) {
  // Check if all assigned evaluators have completed their evaluations
}

serve(handler);