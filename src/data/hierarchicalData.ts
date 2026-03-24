import rawData from './competences.json';

export interface JobData {
    skills: string[];
    tools: string[];
}

export interface DomainData {
    jobs: Record<string, JobData>;
}

export type HierarchicalData = Record<string, DomainData>;

const transformData = (): HierarchicalData => {
    const result: HierarchicalData = {};

    if (!rawData || !rawData.domaines) return result;

    rawData.domaines.forEach((d: any) => {
        const domainName = d.domaine;
        if (!domainName) return;

        const jobs: Record<string, JobData> = {};

        if (d.metiers && Array.isArray(d.metiers)) {
            d.metiers.forEach((m: any) => {
                // Handle variant keys (metier vs métier, competences_cles vs compétences_clés)
                const jobName = m.metier || m.métier;
                const skills = m.competences_cles || m.compétences_clés || [];
                const tools = m.outils || [];

                if (jobName) {
                    jobs[jobName] = {
                        skills: Array.isArray(skills) ? skills : [],
                        tools: Array.isArray(tools) ? tools : [],
                    };
                }
            });
        }

        result[domainName] = { jobs };
    });

    return result;
};

export const HIERARCHICAL_DATA = transformData();
