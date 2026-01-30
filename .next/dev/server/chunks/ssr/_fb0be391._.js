module.exports = [
"[project]/shared/lib/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://dyzhqjqulfbgmbsqqxif.supabase.co"), ("TURBOPACK compile-time value", "sb_publishable_gNKn8DrzyZpSEU3CyibJvg_TI5rzxpC"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing sessions.
                }
            }
        }
    });
}
}),
"[project]/entities/company/types.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "companyFromRow",
    ()=>companyFromRow,
    "companyMemberFromRow",
    ()=>companyMemberFromRow
]);
function companyFromRow(row) {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        industry: row.industry,
        location: row.location,
        contactPhone: row.contact_phone,
        contactEmail: row.contact_email,
        contactPerson: row.contact_person,
        buyerEnabled: row.buyer_enabled,
        supplierEnabled: row.supplier_enabled,
        deletedAt: row.deleted_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}
function companyMemberFromRow(row) {
    return {
        id: row.id,
        companyId: row.company_id,
        userId: row.user_id,
        role: row.role,
        createdAt: row.created_at
    };
}
}),
"[project]/entities/company/repo.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addCompanyMember",
    ()=>addCompanyMember,
    "createCompany",
    ()=>createCompany,
    "getCompanyById",
    ()=>getCompanyById,
    "getCompanyMembers",
    ()=>getCompanyMembers,
    "getUserCompanies",
    ()=>getUserCompanies,
    "getUserPrimaryCompany",
    ()=>getUserPrimaryCompany,
    "isUserCompanyMember",
    ()=>isUserCompanyMember,
    "softDeleteCompany",
    ()=>softDeleteCompany,
    "updateCompany",
    ()=>updateCompany
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$company$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/entities/company/types.ts [app-rsc] (ecmascript)");
;
async function createCompany(supabase, data) {
    const { data: row, error } = await supabase.from('companies').insert({
        name: data.name,
        description: data.description || null,
        industry: data.industry || null,
        location: data.location || null,
        buyer_enabled: data.buyerEnabled,
        supplier_enabled: data.supplierEnabled
    }).select().single();
    if (error) throw error;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$company$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["companyFromRow"])(row);
}
async function getCompanyById(supabase, companyId) {
    const { data: row, error } = await supabase.from('companies').select('*').eq('id', companyId).is('deleted_at', null).single();
    if (error) {
        if (error.code === 'PGRST116') return null // Not found
        ;
        throw error;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$company$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["companyFromRow"])(row);
}
async function updateCompany(supabase, companyId, data) {
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.industry !== undefined) updateData.industry = data.industry;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.buyerEnabled !== undefined) updateData.buyer_enabled = data.buyerEnabled;
    if (data.supplierEnabled !== undefined) updateData.supplier_enabled = data.supplierEnabled;
    const { data: row, error } = await supabase.from('companies').update(updateData).eq('id', companyId).select().single();
    if (error) throw error;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$company$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["companyFromRow"])(row);
}
async function softDeleteCompany(supabase, companyId) {
    const { error } = await supabase.from('companies').update({
        deleted_at: new Date().toISOString()
    }).eq('id', companyId);
    if (error) throw error;
}
async function addCompanyMember(supabase, companyId, userId, role = 'member') {
    const { data: row, error } = await supabase.from('company_members').insert({
        company_id: companyId,
        user_id: userId,
        role
    }).select().single();
    if (error) throw error;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$company$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["companyMemberFromRow"])(row);
}
async function getCompanyMembers(supabase, companyId) {
    const { data: rows, error } = await supabase.from('company_members').select('*').eq('company_id', companyId);
    if (error) throw error;
    return rows.map(__TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$company$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["companyMemberFromRow"]);
}
async function getUserCompanies(supabase, userId) {
    const { data: memberRows, error: memberError } = await supabase.from('company_members').select('company_id').eq('user_id', userId);
    if (memberError) throw memberError;
    if (!memberRows || memberRows.length === 0) {
        return [];
    }
    const companyIds = memberRows.map((m)=>m.company_id);
    const { data: rows, error } = await supabase.from('companies').select('*').in('id', companyIds).is('deleted_at', null);
    if (error) throw error;
    return rows.map(__TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$company$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["companyFromRow"]);
}
async function getUserPrimaryCompany(supabase, userId) {
    const companies = await getUserCompanies(supabase, userId);
    return companies[0] || null;
}
async function isUserCompanyMember(supabase, userId, companyId) {
    const { data, error } = await supabase.from('company_members').select('id').eq('user_id', userId).eq('company_id', companyId).single();
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
}
}),
"[project]/features/company/ui/DashboardNav.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardNav",
    ()=>DashboardNav
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DashboardNav = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DashboardNav() from the server but DashboardNav is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/features/company/ui/DashboardNav.tsx <module evaluation>", "DashboardNav");
}),
"[project]/features/company/ui/DashboardNav.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardNav",
    ()=>DashboardNav
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DashboardNav = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DashboardNav() from the server but DashboardNav is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/features/company/ui/DashboardNav.tsx", "DashboardNav");
}),
"[project]/features/company/ui/DashboardNav.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$company$2f$ui$2f$DashboardNav$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/features/company/ui/DashboardNav.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$company$2f$ui$2f$DashboardNav$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/features/company/ui/DashboardNav.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$company$2f$ui$2f$DashboardNav$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/features/company/ui/DashboardHeader.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardHeader",
    ()=>DashboardHeader
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DashboardHeader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DashboardHeader() from the server but DashboardHeader is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/features/company/ui/DashboardHeader.tsx <module evaluation>", "DashboardHeader");
}),
"[project]/features/company/ui/DashboardHeader.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardHeader",
    ()=>DashboardHeader
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DashboardHeader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DashboardHeader() from the server but DashboardHeader is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/features/company/ui/DashboardHeader.tsx", "DashboardHeader");
}),
"[project]/features/company/ui/DashboardHeader.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$company$2f$ui$2f$DashboardHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/features/company/ui/DashboardHeader.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$company$2f$ui$2f$DashboardHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/features/company/ui/DashboardHeader.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$company$2f$ui$2f$DashboardHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/features/auth/ui/AuthStoreInitializer.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthStoreInitializer",
    ()=>AuthStoreInitializer
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const AuthStoreInitializer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call AuthStoreInitializer() from the server but AuthStoreInitializer is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/features/auth/ui/AuthStoreInitializer.tsx <module evaluation>", "AuthStoreInitializer");
}),
"[project]/features/auth/ui/AuthStoreInitializer.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthStoreInitializer",
    ()=>AuthStoreInitializer
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const AuthStoreInitializer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call AuthStoreInitializer() from the server but AuthStoreInitializer is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/features/auth/ui/AuthStoreInitializer.tsx", "AuthStoreInitializer");
}),
"[project]/features/auth/ui/AuthStoreInitializer.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$auth$2f$ui$2f$AuthStoreInitializer$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/features/auth/ui/AuthStoreInitializer.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$auth$2f$ui$2f$AuthStoreInitializer$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/features/auth/ui/AuthStoreInitializer.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$auth$2f$ui$2f$AuthStoreInitializer$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/(dashboard)/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$company$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/entities/company/repo.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$company$2f$ui$2f$DashboardNav$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/company/ui/DashboardNav.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$company$2f$ui$2f$DashboardHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/company/ui/DashboardHeader.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$auth$2f$ui$2f$AuthStoreInitializer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/auth/ui/AuthStoreInitializer.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
async function DashboardLayout({ children }) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login');
    }
    const company = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$company$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserPrimaryCompany"])(supabase, user.id);
    if (!company) {
        // User exists but no company - should not happen in normal flow
        // Could redirect to a company setup page
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login');
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$auth$2f$ui$2f$AuthStoreInitializer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AuthStoreInitializer"], {
                company: company
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/layout.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$company$2f$ui$2f$DashboardHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DashboardHeader"], {
                user: user,
                company: company
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/layout.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$company$2f$ui$2f$DashboardNav$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DashboardNav"], {
                        company: company
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/layout.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 p-4 md:p-6 lg:p-8 max-w-full",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/layout.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/layout.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/layout.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_fb0be391._.js.map