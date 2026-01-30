module.exports = [
"[project]/features/auth/services/auth-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0035891850c1df4c0e43df03a311bc05d9cd0dd883":"getCurrentUser","00676791884c2a002e4551a160e8b0e063b3bb25c4":"getSession","00bf7534dfdb838379ef7c4d22cb1a74ddd4f6a0ea":"logout","4015433ccde8ef7a66c783d5fe0a9cebe6f1f6a075":"login","401756737882135298e2e32380fd384ff259da2516":"register"},"",""] */ __turbopack_context__.s([
    "getCurrentUser",
    ()=>getCurrentUser,
    "getSession",
    ()=>getSession,
    "login",
    ()=>login,
    "logout",
    ()=>logout,
    "register",
    ()=>register
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
const TERMS_VERSION = '1.0';
async function login(formData) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const email = formData.get('email');
    const password = formData.get('password');
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) {
        return {
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/', 'layout');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/dashboard');
}
async function logout() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    await supabase.auth.signOut();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/', 'layout');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login');
}
async function register(data) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                full_name: data.fullName
            }
        }
    });
    if (authError) {
        return {
            error: authError.message
        };
    }
    if (!authData.user) {
        return {
            error: 'Failed to create user'
        };
    }
    const userId = authData.user.id;
    try {
        // 2. Complete registration via RPC (creates company, member, terms acceptance)
        // Using SECURITY DEFINER function to bypass RLS issues after signUp
        const { error: rpcError } = await supabase.rpc('complete_registration', {
            p_user_id: userId,
            p_company_name: data.companyName,
            p_company_description: data.companyDescription || null,
            p_industry: data.industry || null,
            p_location: data.location || null,
            p_contact_phone: data.contactPhone,
            p_contact_email: data.contactEmail || null,
            p_contact_person: data.contactPerson || null,
            p_buyer_enabled: data.buyerEnabled,
            p_supplier_enabled: data.supplierEnabled,
            p_terms_version: TERMS_VERSION
        });
        if (rpcError) {
            console.error('Registration RPC error:', rpcError);
            return {
                error: 'Failed to complete registration. Please try again.'
            };
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/', 'layout');
        return {
            userId
        };
    } catch (error) {
        console.error('Registration error:', error);
        return {
            error: 'Failed to complete registration. Please try again.'
        };
    }
}
async function getCurrentUser() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}
async function getSession() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    login,
    logout,
    register,
    getCurrentUser,
    getSession
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(login, "4015433ccde8ef7a66c783d5fe0a9cebe6f1f6a075", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(logout, "00bf7534dfdb838379ef7c4d22cb1a74ddd4f6a0ea", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(register, "401756737882135298e2e32380fd384ff259da2516", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCurrentUser, "0035891850c1df4c0e43df03a311bc05d9cd0dd883", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getSession, "00676791884c2a002e4551a160e8b0e063b3bb25c4", null);
}),
"[project]/entities/notification/repo.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getNotificationCounts",
    ()=>getNotificationCounts,
    "getRfqsWithNewOffers",
    ()=>getRfqsWithNewOffers,
    "getWonRfqs",
    ()=>getWonRfqs,
    "markOffersAsSeen",
    ()=>markOffersAsSeen,
    "markRfqsAsSeen",
    ()=>markRfqsAsSeen,
    "markWinsAsSeen",
    ()=>markWinsAsSeen
]);
async function getNotificationCounts(supabase, userId) {
    // Run all queries in parallel
    const [offersResult, rfqsResult, winsResult] = await Promise.all([
        supabase.rpc('get_new_offers_count', {
            p_user_id: userId
        }),
        supabase.rpc('get_new_rfqs_count', {
            p_user_id: userId
        }),
        supabase.rpc('get_new_wins_count', {
            p_user_id: userId
        })
    ]);
    return {
        newOffers: offersResult.data ?? 0,
        newRfqs: rfqsResult.data ?? 0,
        newWins: winsResult.data ?? 0
    };
}
async function markOffersAsSeen(supabase, userId) {
    const { error } = await supabase.rpc('mark_offers_seen', {
        p_user_id: userId
    });
    if (error) throw error;
}
async function markRfqsAsSeen(supabase, userId) {
    const { error } = await supabase.rpc('mark_rfqs_seen', {
        p_user_id: userId
    });
    if (error) throw error;
}
async function markWinsAsSeen(supabase, userId) {
    const { error } = await supabase.rpc('mark_wins_seen', {
        p_user_id: userId
    });
    if (error) throw error;
}
async function getRfqsWithNewOffers(supabase, userId) {
    const { data, error } = await supabase.rpc('get_rfqs_with_new_offers', {
        p_user_id: userId
    });
    if (error) throw error;
    return data?.map((row)=>row.rfq_id) || [];
}
async function getWonRfqs(supabase, userId) {
    // Get user's company through company_members
    const { data: memberships } = await supabase.from('company_members').select('company_id').eq('user_id', userId);
    if (!memberships || memberships.length === 0) {
        return [];
    }
    const companyIds = memberships.map((m)=>m.company_id);
    // Get RFQ IDs where the user's company's offer was selected
    const { data, error } = await supabase.from('offers').select('rfq_id').in('company_id', companyIds).eq('is_selected', true).is('deleted_at', null);
    if (error) throw error;
    return (data || []).map((row)=>row.rfq_id);
}
}),
"[project]/features/notification/services/notification-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00340f65de870789f70e6e0b38bdc45b6da1e1f476":"markWinsSeenAction","003a75ea0cd6e302c7135b84fdefe8efe284d5f8c0":"markOffersSeenAction","0067c3f5d3b375b0774e52fa53583fc0a5a2b323e7":"getRfqsWithNewOffersAction","00a10e1e61f983074205d47d08279ee38a4d1da496":"markRfqsSeenAction"},"",""] */ __turbopack_context__.s([
    "getRfqsWithNewOffersAction",
    ()=>getRfqsWithNewOffersAction,
    "markOffersSeenAction",
    ()=>markOffersSeenAction,
    "markRfqsSeenAction",
    ()=>markRfqsSeenAction,
    "markWinsSeenAction",
    ()=>markWinsSeenAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$notification$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/entities/notification/repo.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function markOffersSeenAction() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Not authenticated');
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$notification$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markOffersAsSeen"])(supabase, user.id);
}
async function markRfqsSeenAction() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Not authenticated');
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$notification$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markRfqsAsSeen"])(supabase, user.id);
}
async function markWinsSeenAction() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Not authenticated');
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$notification$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markWinsAsSeen"])(supabase, user.id);
}
async function getRfqsWithNewOffersAction() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return [];
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$notification$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRfqsWithNewOffers"])(supabase, user.id);
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    markOffersSeenAction,
    markRfqsSeenAction,
    markWinsSeenAction,
    getRfqsWithNewOffersAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(markOffersSeenAction, "003a75ea0cd6e302c7135b84fdefe8efe284d5f8c0", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(markRfqsSeenAction, "00a10e1e61f983074205d47d08279ee38a4d1da496", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(markWinsSeenAction, "00340f65de870789f70e6e0b38bdc45b6da1e1f476", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getRfqsWithNewOffersAction, "0067c3f5d3b375b0774e52fa53583fc0a5a2b323e7", null);
}),
"[project]/.next-internal/server/app/(dashboard)/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/features/auth/services/auth-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/features/notification/services/notification-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$auth$2f$services$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/auth/services/auth-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$notification$2f$services$2f$notification$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/notification/services/notification-actions.ts [app-rsc] (ecmascript)");
;
;
;
;
}),
"[project]/.next-internal/server/app/(dashboard)/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/features/auth/services/auth-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/features/notification/services/notification-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00340f65de870789f70e6e0b38bdc45b6da1e1f476",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$notification$2f$services$2f$notification$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markWinsSeenAction"],
    "003a75ea0cd6e302c7135b84fdefe8efe284d5f8c0",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$notification$2f$services$2f$notification$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markOffersSeenAction"],
    "00a10e1e61f983074205d47d08279ee38a4d1da496",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$notification$2f$services$2f$notification$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markRfqsSeenAction"],
    "00bf7534dfdb838379ef7c4d22cb1a74ddd4f6a0ea",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$auth$2f$services$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logout"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$dashboard$292f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$features$2f$auth$2f$services$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$features$2f$notification$2f$services$2f$notification$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(dashboard)/dashboard/page/actions.js { ACTIONS_MODULE0 => "[project]/features/auth/services/auth-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/features/notification/services/notification-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$auth$2f$services$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/auth/services/auth-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$notification$2f$services$2f$notification$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/notification/services/notification-actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_d531d7af._.js.map