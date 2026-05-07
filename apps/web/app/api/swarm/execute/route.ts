import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { WorkflowExecutor } from '../../../../../packages/agents/src/services/WorkflowExecutor';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { workflow, triggerData } = await request.json();

    const executor = new WorkflowExecutor();
    const result = await executor.executeWorkflow(userId, workflow, triggerData);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Swarm execution error:', error);
    return NextResponse.json({ error: error.message || 'Execution failed' }, { status: 500 });
  }
}
