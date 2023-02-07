## AWS Documentation

### DevOps.yaml

This template defines the resources needed for a Pipeline that automatically tests, builds, and deploys this application onto AWS. Any changes to the pipeline itself will also be deployed in the pipeline.

* 1 CodePipeline
* 3 CodeBuild Jobs (defined in the [builds](builds/) directory)
  * Code Tests
  * Docker Build
  * End-to-end Tests
* Developer Access IAM Policy
  * Read all CodePipeline, CodeBuild, and CloudFormation resources
  * Restart CodePipeline
* Supporting Resources
  * IAM Roles
  * Artifacts S3 Bucket
  * ECR Repositories

#### Getting up and running

To create a new development stage using this template, run the following command:

```sh
$> aws cloudformation create-stack --stack-name ss_django-[branch]-devops --parameters ParameterKey=GitHubToken,ParameterValue=[your-pat] ParameterKey=GitBranch,ParameterValue=[branch] --template-body file://AWS/cloudformation/DevOps.yaml --role-arn arn:aws:iam::514205568277:role/CloudFormationRole --capabilities CAPABILITY_IAM
```

### Stack.yaml

This template is the root CloudFormation template that deploys the application itself. It has a few shared resources and several nested stacks.

* Nested Stacks
  * Django Backend Fargate Service ([FargateService.yaml](FargateService.yaml))
  * Chat Backend Fargate Service ([FargateService.yaml](FargateService.yaml))
  * RDS Cluster ([RDS.yaml](RDS.yaml))
  * VPC ([VPC.yaml](VPC.yaml))
  * CDN ([CDN.yaml](CDN.yaml))
* Shared Resources
  * Load Balancer
  * IAM Roles
  * ECS Cluster
  * S3 Bucket
  * DynamoDB Chat Table


### FargateService.yaml

This template is used for the Admin backend and Chat backend applications. It takes a docker container passed in from the build step, and runs it as a Fargate Service. There is Auto-Scaling built-in to keep up with changes in web traffic.


### VPC.yaml

This template creates a VPC for us to launch all of the compute resources into.


### RDS.yaml

This template creates an RDS cluster to store permanent relational data from the apps.

### CDN.yaml

This template creates the resources to house and serve our static frontend to the world wide web. It is important to note that all production traffic goes through the CDN. There are caching rules that allow fully static content, and for APIs to be cacheable at custom durations to reduce the webserver load.