import * as models from '../../../models';
import requests from './requests';

export class WorkflowTemplateService {
    public create(template: models.WorkflowTemplate, namespace: string) {
        return requests
            .post(`/argo/workflow-templates/${namespace}`)
            .send({template})
            .then(res => res.body as models.WorkflowTemplate);
    }

    public list(namespace: string) {
        return requests
            .get(`/argo/workflow-templates/${namespace}`)
            .then(res => res.body as models.WorkflowTemplateList)
            .then(list => list.items || []);
    }

    public get(name: string, namespace: string) {
        return requests.get(`/argo/workflow-templates/${namespace}/${name}`).then(res => res.body as models.WorkflowTemplate);
    }

    public update(template: models.WorkflowTemplate, name: string, namespace: string) {
        return requests
            .put(`/argo/workflow-templates/${namespace}/${name}`)
            .send({template})
            .then(res => res.body as models.WorkflowTemplate);
    }

    public delete(name: string, namespace: string) {
        return requests.delete(`/argo/workflow-templates/${namespace}/${name}`);
    }
}
