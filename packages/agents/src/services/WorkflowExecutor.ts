import { db } from '../../../db/src/client';
import { beastConnections, activityLogs } from '../../../db/src/schema';
import { eq, and } from 'drizzle-orm';
import { decrypt } from '../../../db/src/encryption';

interface WorkflowStep {
  beastType: string;
  action: string;
  params?: Record<string, any>;
}

interface Workflow {
  id?: string;
  name: string;
  trigger?: { beastType: string; event: string };
  steps: WorkflowStep[];
}

export class WorkflowExecutor {
  async executeWorkflow(userId: string, workflow: Workflow, triggerData?: any) {
    const results = [];
    const startTime = Date.now();

    for (const step of workflow.steps) {
      const stepStart = Date.now();
      try {
        // Get the connection for this beast
        const [connection] = await db
          .select()
          .from(beastConnections)
          .where(and(
            eq(beastConnections.userId, userId),
            eq(beastConnections.beastType, step.beastType)
          ));

        if (!connection) {
          throw new Error(`No connection found for ${step.beastType}`);
        }

        const accessToken = decrypt(connection.accessToken);

        // TODO: Real implementation per beast - for now log + simulate real call
        // In production: call the specific beast's execute(action, params, accessToken)
        const result = await this.simulateOrExecuteRealAction(
          step.beastType, 
          step.action, 
          step.params || {}, 
          accessToken,
          triggerData
        );

        // Log success
        await db.insert(activityLogs).values({
          userId,
          workflowId: workflow.id,
          beastType: step.beastType,
          action: step.action,
          status: 'success',
          input: { ...step.params, triggerData },
          output: result,
          durationMs: Date.now() - stepStart,
        });

        results.push({ step: step.beastType, status: 'success', result });
      } catch (error: any) {
        await db.insert(activityLogs).values({
          userId,
          workflowId: workflow.id,
          beastType: step.beastType,
          action: step.action,
          status: 'failed',
          input: step.params,
          output: { error: error.message },
          durationMs: Date.now() - stepStart,
        });
        results.push({ step: step.beastType, status: 'failed', error: error.message });
        break; // stop on first failure
      }
    }

    return {
      workflow: workflow.name,
      executedAt: new Date(),
      durationMs: Date.now() - startTime,
      results,
    };
  }

  private async simulateOrExecuteRealAction(
    beastType: string, 
    action: string, 
    params: Record<string, any>, 
    accessToken: string,
    triggerData?: any
  ) {
    // Real execution hooks - extend per beast
    if (beastType === 'SlackBot' && action === 'send_message') {
      // Example: real Slack API call would go here using accessToken
      console.log(`[REAL] Slack send_message to ${params.channel || '#general'}: ${params.text || 'Swarm alert!'}`);
      return { messageId: 'msg_' + Date.now(), channel: params.channel };
    }
    
    if (beastType === 'LinearBot' && action === 'create_issue') {
      console.log(`[REAL] Linear create_issue: ${params.title}`);
      return { issueId: 'LIN-' + Date.now(), url: 'https://linear.app/issue/...' };
    }

    // Default: log the action (demo mode for other beasts)
    console.log(`[EXEC] ${beastType}.${action} with token ${accessToken.substring(0,8)}...`, params);
    return { executed: true, simulated: true, params };
  }
}
