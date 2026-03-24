export const API_BASE_URL = 'http://localhost:5000/api';
export const STORAGE_URL = 'http://localhost:5000';

/**
 * Global API response interface
 */
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    token?: string;
    user?: any;
    requestId?: string;
    missionId?: string;
    stats?: any;
    users?: any[];
    companies?: any[];
    consultants?: any[];
    newStatus?: string;
    missions?: any[];
    consultant?: any;
    conversations?: any[];
    messages?: any[];
    conversationId?: string;
    url?: string;
    type?: string;
    originalName?: string;
}

/**
 * Generic request helper with JWT support
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('token');

    const headers: any = {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    if (headers['Content-Type'] === 'undefined') {
        delete headers['Content-Type'];
    } else if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Quelque chose s\'est mal passé');
        }

        return data;
    } catch (error: any) {
        console.error('API Error:', error.message);
        return {
            success: false,
            message: error.message
        };
    }
}

/**
 * API Service
 */
export const api = {
    // Auth
    registerCompany: (data: any) => request('/auth/register/company', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    registerConsultant: (data: any) => {
        const isFormData = data instanceof FormData;
        return request('/auth/register/consultant', {
            method: 'POST',
            body: isFormData ? data : JSON.stringify(data),
            // When using FormData, fetch automatically sets the correct Content-Type with boundary
            headers: isFormData ? { 'Content-Type': 'undefined' } : {}
        });
    },

    login: (data: any) => request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    getMe: () => request('/auth/me', {
        method: 'GET'
    }),

    updateProfile: (data: any) => request('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    // Missions
    publishMission: (data: any) => request('/missions', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    getMissions: () => request('/missions', {
        method: 'GET'
    }),

    getITMissions: () => request<any>('/missions/it-missions', {
        method: 'GET'
    }),

    getMyMissions: () => request('/missions/my-missions', {
        method: 'GET'
    }),

    getMissionById: (id: string) => request(`/missions/${id}`, {
        method: 'GET'
    }),

    updateMission: (id: string, data: any) => request(`/missions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    updateMissionStatus: (id: string, status: string) => request(`/missions/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    }),

    updateMissionVisibility: (id: string, data: {
        visibility_mode?: string;
        is_company_name_visible?: boolean;
        require_nda?: boolean;
    }) => request(`/missions/${id}/visibility`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    deleteMission: (id: string) => request(`/missions/${id}`, {
        method: 'DELETE'
    }),

    // Admin
    getPendingRequests: () => request<any>('/admin/pending', {
        method: 'GET'
    }),

    approveCompany: (requestId: string) => request<any>('/admin/approve-company', {
        method: 'POST',
        body: JSON.stringify({ requestId })
    }),

    approveConsultant: (requestId: string) => request<any>('/admin/approve-consultant', {
        method: 'POST',
        body: JSON.stringify({ requestId })
    }),

    getUsers: () => request<any>('/admin/users', {
        method: 'GET'
    }),

    getStats: () => request<any>('/admin/stats', {
        method: 'GET'
    }),

    rejectRequest: (requestId: string, type: 'company' | 'consultant') => request<any>('/admin/reject-request', {
        method: 'POST',
        body: JSON.stringify({ requestId, type })
    }),

    toggleUserStatus: (userId: string, role: string, currentStatus: string) => request<any>('/admin/toggle-user-status', {
        method: 'POST',
        body: JSON.stringify({ userId, role, currentStatus })
    }),

    deleteUser: (userId: string, role: string) => request<any>('/admin/delete-user', {
        method: 'DELETE',
        body: JSON.stringify({ userId, role })
    }),

    getAdminMissions: () => request<any>('/admin/missions', {
        method: 'GET'
    }),

    approveMission: (missionId: string) => request<any>('/admin/approve-mission', {
        method: 'POST',
        body: JSON.stringify({ missionId })
    }),

    rejectMission: (missionId: string) => request<any>('/admin/reject-mission', {
        method: 'POST',
        body: JSON.stringify({ missionId })
    }),

    getAllConversations: () => request<any>('/admin/conversations', {
        method: 'GET'
    }),

    // Consultants
    searchConsultants: (params: {
        query?: string,
        country?: string,
        city?: string,
        domain?: string,
        metier?: string,
        minTjm?: number | string,
        maxTjm?: number | string,
        skills?: string[],
        outils?: string[]
    }) => {
        const queryParams = new URLSearchParams();
        if (params.query) queryParams.append('query', params.query);
        if (params.country) queryParams.append('country', params.country);
        if (params.city) queryParams.append('city', params.city);
        if (params.domain) queryParams.append('domain', params.domain);
        if (params.metier) queryParams.append('metier', params.metier);
        if (params.minTjm) queryParams.append('minTjm', params.minTjm.toString());
        if (params.maxTjm) queryParams.append('maxTjm', params.maxTjm.toString());

        if (params.skills) {
            params.skills.forEach(s => queryParams.append('skills', s));
        }
        if (params.outils) {
            params.outils.forEach(o => queryParams.append('outils', o));
        }

        return request<any>(`/consultants/search?${queryParams.toString()}`, {
            method: 'GET'
        });
    },

    getConsultantById: (id: string) => request<any>(`/consultants/${id}`, {
        method: 'GET'
    }),

    // Chat
    getConversations: () => request<any>('/chat/conversations', {
        method: 'GET'
    }),

    getChatMessages: (conversationId: string) => request<any>(`/chat/conversations/${conversationId}/messages`, {
        method: 'GET'
    }),

    sendChatMessage: (data: {
        receiverId?: string;
        content: string;
        conversationId?: string;
        attachmentUrl?: string;
        attachmentType?: string;
    }) => request<any>('/chat/messages', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    checkChatConversation: (consultantId: string) => request<any>(`/chat/conversations/check/${consultantId}`, {
        method: 'GET'
    }),

    uploadChatAttachment: (formData: FormData) => request<any>('/chat/messages/attachment', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'undefined' }
    }),

    // Applications
    applyToMission: (missionId: string) => request<any>('/applications', {
        method: 'POST',
        body: JSON.stringify({ mission_id: missionId })
    }),

    getAdminApplications: () => request<any>('/applications/admin', {
        method: 'GET'
    }),

    getApplicationsByMission: (missionId: string) => request<any>(`/applications/mission/${missionId}`, {
        method: 'GET'
    }),

    validateApplication: (id: string, action: 'approve' | 'reject') => request<any>(`/applications/admin/${id}/validate`, {
        method: 'PUT',
        body: JSON.stringify({ action })
    }),

    getCompanyApplications: (missionId?: string) => request<any>(`/applications/company${missionId ? `?missionId=${missionId}` : ''}`, {
        method: 'GET'
    }),

    updateApplicationStatus: (id: string, status: string) => request<any>(`/applications/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    }),

    // ATS Checker
    checkATS: (formData: FormData) => request<any>('/ats/check', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'undefined' }
    }),

    // CV Generation
    generateCV: (data: { resumeText: string, analysis: any, jobDescription?: string }) => request<any>('/cv/generate', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    downloadCVPDF: (htmlContent: string) => {
        const token = localStorage.getItem('token');
        return fetch(`${API_BASE_URL}/cv/download`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ htmlContent })
        }).then(res => res.blob());
    },

    // Axios-style methods for generic use

    get: (endpoint: string) => request(endpoint, { method: 'GET' }),
    post: (endpoint: string, data?: any) => request(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined
    }),
    put: (endpoint: string, data?: any) => request(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined
    }),
    delete: (endpoint: string, data?: any) => request(endpoint, {
        method: 'DELETE',
        body: data ? JSON.stringify(data) : undefined
    }),
};

// Default export for compatibility
export default api;

