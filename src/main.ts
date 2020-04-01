import * as core from "@actions/core";
import * as github from "@actions/github";

type DeploymentState =
  | "error"
  | "failure"
  | "inactive"
  | "in_progress"
  | "queued"
  | "pending"
  | "success";

async function run() {
  try {
    const context = github.context;
    const defaultUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${context.sha}/checks`;

    const token = core.getInput("token", { required: true });
    const targetUrl = core.getInput("target_url", { required: false }) || defaultUrl;
    const description = core.getInput("description", { required: false }) || "";
    const deploymentId = core.getInput("deployment_id");
    const environmentUrl = core.getInput("environment_url", { required: false }) || "";
    const state = core.getInput("state") as DeploymentState;

    const client = new github.GitHub(token);

    await client.repos.createDeploymentStatus({
      ...context.repo,
      deployment_id: parseInt(deploymentId),
      description,
      environment_url: environmentUrl,
      log_url: targetUrl,
      state,
      target_url: targetUrl,
    });
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
