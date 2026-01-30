module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/(dashboard)/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/(dashboard)/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/(dashboard)/loading.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/(dashboard)/loading.tsx [app-rsc] (ecmascript)"));
}),
"[project]/entities/rfq/types.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categoryFromRow",
    ()=>categoryFromRow,
    "rfqFileFromRow",
    ()=>rfqFileFromRow,
    "rfqFromRow",
    ()=>rfqFromRow
]);
function categoryFromRow(row) {
    return {
        id: row.id,
        name: row.name,
        createdAt: row.created_at
    };
}
function rfqFromRow(row) {
    return {
        id: row.id,
        companyId: row.company_id,
        title: row.title,
        description: row.description,
        categoryId: row.category_id,
        quantity: row.quantity,
        budgetMin: row.budget_min,
        budgetMax: row.budget_max,
        deadline: row.deadline,
        status: row.status,
        deletedAt: row.deleted_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}
function rfqFileFromRow(row) {
    return {
        id: row.id,
        rfqId: row.rfq_id,
        fileName: row.file_name,
        filePath: row.file_path,
        fileSize: row.file_size,
        mimeType: row.mime_type,
        createdAt: row.created_at
    };
}
}),
"[project]/entities/rfq/repo.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createRFQ",
    ()=>createRFQ,
    "getCategoryById",
    ()=>getCategoryById,
    "getRFQById",
    ()=>getRFQById,
    "listCategories",
    ()=>listCategories,
    "listCompanyRFQs",
    ()=>listCompanyRFQs,
    "listPublicRFQs",
    ()=>listPublicRFQs,
    "softDeleteRFQ",
    ()=>softDeleteRFQ,
    "updateRFQ",
    ()=>updateRFQ,
    "updateRFQStatus",
    ()=>updateRFQStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/entities/rfq/types.ts [app-rsc] (ecmascript)");
;
async function listCategories(supabase) {
    const { data: rows, error } = await supabase.from('categories').select('*').order('name');
    if (error) throw error;
    return rows.map(__TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["categoryFromRow"]);
}
async function getCategoryById(supabase, categoryId) {
    const { data: row, error } = await supabase.from('categories').select('*').eq('id', categoryId).single();
    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["categoryFromRow"])(row);
}
async function createRFQ(supabase, data) {
    const { data: row, error } = await supabase.from('rfqs').insert({
        company_id: data.companyId,
        title: data.title,
        description: data.description || null,
        category_id: data.categoryId || null,
        quantity: data.quantity || null,
        budget_min: data.budgetMin || null,
        budget_max: data.budgetMax || null,
        deadline: data.deadline.toISOString()
    }).select().single();
    if (error) throw error;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rfqFromRow"])(row);
}
async function getRFQById(supabase, rfqId) {
    const { data: row, error } = await supabase.from('rfqs').select(`
      *,
      company:companies(id, name, location, contact_phone, contact_email, contact_person),
      category:categories(id, name, created_at)
    `).eq('id', rfqId).is('deleted_at', null).single();
    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    const rfq = (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rfqFromRow"])(row);
    const companyData = row.company;
    return {
        ...rfq,
        company: companyData ? {
            id: companyData.id,
            name: companyData.name,
            location: companyData.location,
            contactPhone: companyData.contact_phone,
            contactEmail: companyData.contact_email,
            contactPerson: companyData.contact_person
        } : undefined,
        category: row.category ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["categoryFromRow"])(row.category) : null
    };
}
async function listPublicRFQs(supabase, filters, page = 1, pageSize = 20) {
    let query = supabase.from('rfqs').select(`
      *,
      company:companies(id, name, location),
      category:categories(id, name, created_at),
      offers(count)
    `, {
        count: 'exact'
    }).is('deleted_at', null).eq('status', 'open').gte('deadline', new Date().toISOString());
    if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
    }
    if (filters?.location) {
        query = query.ilike('companies.location', `%${filters.location}%`);
    }
    if (filters?.deadlineBefore) {
        query = query.lte('deadline', filters.deadlineBefore);
    }
    if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data: rows, error, count } = await query.order('created_at', {
        ascending: false
    }).range(from, to);
    if (error) throw error;
    const rfqs = (rows || []).map((row)=>{
        const rfq = (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rfqFromRow"])(row);
        return {
            ...rfq,
            company: row.company,
            category: row.category ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["categoryFromRow"])(row.category) : null,
            offersCount: row.offers?.[0]?.count || 0
        };
    });
    return {
        rfqs,
        total: count || 0
    };
}
async function listCompanyRFQs(supabase, companyId, filters) {
    let query = supabase.from('rfqs').select(`
      *,
      company:companies(id, name, location),
      category:categories(id, name, created_at),
      offers(count)
    `).eq('company_id', companyId).is('deleted_at', null);
    if (filters?.status) {
        query = query.eq('status', filters.status);
    }
    const { data: rows, error } = await query.order('created_at', {
        ascending: false
    });
    if (error) throw error;
    return (rows || []).map((row)=>{
        const rfq = (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rfqFromRow"])(row);
        return {
            ...rfq,
            company: row.company,
            category: row.category ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["categoryFromRow"])(row.category) : null,
            offersCount: row.offers?.[0]?.count || 0
        };
    });
}
async function updateRFQ(supabase, rfqId, data) {
    const updateData = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.categoryId !== undefined) updateData.category_id = data.categoryId;
    if (data.quantity !== undefined) updateData.quantity = data.quantity;
    if (data.budgetMin !== undefined) updateData.budget_min = data.budgetMin;
    if (data.budgetMax !== undefined) updateData.budget_max = data.budgetMax;
    if (data.deadline !== undefined) updateData.deadline = data.deadline.toISOString();
    const { data: row, error } = await supabase.from('rfqs').update(updateData).eq('id', rfqId).select().single();
    if (error) throw error;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rfqFromRow"])(row);
}
async function updateRFQStatus(supabase, rfqId, status) {
    const { data: row, error } = await supabase.from('rfqs').update({
        status
    }).eq('id', rfqId).select().single();
    if (error) throw error;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rfqFromRow"])(row);
}
async function softDeleteRFQ(supabase, rfqId) {
    const { error } = await supabase.from('rfqs').update({
        deleted_at: new Date().toISOString()
    }).eq('id', rfqId);
    if (error) throw error;
}
}),
"[project]/features/company/ui/DashboardContent.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardContent",
    ()=>DashboardContent
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DashboardContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DashboardContent() from the server but DashboardContent is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/features/company/ui/DashboardContent.tsx <module evaluation>", "DashboardContent");
}),
"[project]/features/company/ui/DashboardContent.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardContent",
    ()=>DashboardContent
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DashboardContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DashboardContent() from the server but DashboardContent is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/features/company/ui/DashboardContent.tsx", "DashboardContent");
}),
"[project]/features/company/ui/DashboardContent.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$company$2f$ui$2f$DashboardContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/features/company/ui/DashboardContent.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$company$2f$ui$2f$DashboardContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/features/company/ui/DashboardContent.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$company$2f$ui$2f$DashboardContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/(dashboard)/dashboard/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$company$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/entities/company/repo.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/entities/rfq/repo.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$company$2f$ui$2f$DashboardContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/company/ui/DashboardContent.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
async function DashboardPage() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login');
    }
    const company = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$company$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserPrimaryCompany"])(supabase, user.id);
    if (!company) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login');
    }
    // Get company RFQs if buyer
    let rfqs = [];
    if (company.buyerEnabled) {
        rfqs = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["listCompanyRFQs"])(supabase, company.id);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$company$2f$ui$2f$DashboardContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DashboardContent"], {
        company: company,
        rfqs: rfqs,
        user: user
    }, void 0, false, {
        fileName: "[project]/app/(dashboard)/dashboard/page.tsx",
        lineNumber: 29,
        columnNumber: 10
    }, this);
}
}),
"[project]/app/(dashboard)/dashboard/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/(dashboard)/dashboard/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__76182d97._.js.map