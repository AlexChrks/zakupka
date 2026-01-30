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
    const { data, error } = await supabase.rpc('get_won_rfqs', {
        p_user_id: userId
    });
    if (error) throw error;
    return data?.map((row)=>row.rfq_id) || [];
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
"[project]/entities/file/repo.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteRFQFile",
    ()=>deleteRFQFile,
    "getFileById",
    ()=>getFileById,
    "getSignedDownloadUrl",
    ()=>getSignedDownloadUrl,
    "listRFQFiles",
    ()=>listRFQFiles,
    "uploadRFQFile",
    ()=>uploadRFQFile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/entities/rfq/types.ts [app-rsc] (ecmascript)");
;
const STORAGE_BUCKET = 'rfq-files';
async function uploadRFQFile(supabase, data) {
    const { rfqId, file } = data;
    // Generate unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${rfqId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    // Upload to storage
    const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, file);
    if (uploadError) throw uploadError;
    // Create metadata record
    const { data: row, error: insertError } = await supabase.from('rfq_files').insert({
        rfq_id: rfqId,
        file_name: file.name,
        file_path: fileName,
        file_size: file.size,
        mime_type: file.type || null
    }).select().single();
    if (insertError) {
        // Clean up uploaded file if metadata insert fails
        await supabase.storage.from(STORAGE_BUCKET).remove([
            fileName
        ]);
        throw insertError;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rfqFileFromRow"])(row);
}
async function listRFQFiles(supabase, rfqId) {
    const { data: rows, error } = await supabase.from('rfq_files').select('*').eq('rfq_id', rfqId).order('created_at', {
        ascending: true
    });
    if (error) throw error;
    return rows.map(__TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rfqFileFromRow"]);
}
async function getSignedDownloadUrl(supabase, filePath, expiresIn = 3600 // 1 hour default
) {
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).createSignedUrl(filePath, expiresIn);
    if (error) throw error;
    return data.signedUrl;
}
async function deleteRFQFile(supabase, fileId) {
    // Get file info first
    const { data: fileRow, error: fetchError } = await supabase.from('rfq_files').select('file_path').eq('id', fileId).single();
    if (fetchError) throw fetchError;
    // Delete from storage
    const { error: storageError } = await supabase.storage.from(STORAGE_BUCKET).remove([
        fileRow.file_path
    ]);
    if (storageError) throw storageError;
    // Delete metadata record
    const { error: deleteError } = await supabase.from('rfq_files').delete().eq('id', fileId);
    if (deleteError) throw deleteError;
}
async function getFileById(supabase, fileId) {
    const { data: row, error } = await supabase.from('rfq_files').select('*').eq('id', fileId).single();
    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rfqFileFromRow"])(row);
}
}),
"[project]/features/rfq/services/file-service.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4029aca26fb6205270e4847cb7f5bf580062162bea":"getSignedDownloadUrlAction","405d7b43ad03e8ceaa96d76e19a8adbda8d1106e7f":"listRFQFilesAction","60b72f70a6a2f948f24887dfef2d6ecbbd876d7356":"uploadRFQFileAction","60cd7fb70e977f3bec8a51109ce4075a4fb72df256":"deleteRFQFileAction"},"",""] */ __turbopack_context__.s([
    "deleteRFQFileAction",
    ()=>deleteRFQFileAction,
    "getSignedDownloadUrlAction",
    ()=>getSignedDownloadUrlAction,
    "listRFQFilesAction",
    ()=>listRFQFilesAction,
    "uploadRFQFileAction",
    ()=>uploadRFQFileAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$file$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/entities/file/repo.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function getSignedDownloadUrlAction(filePath) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const url = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$file$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSignedDownloadUrl"])(supabase, filePath);
        return {
            url
        };
    } catch (error) {
        console.error('Get signed URL error:', error);
        return {
            error: 'Failed to get download URL'
        };
    }
}
async function uploadRFQFileAction(rfqId, formData) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const file = formData.get('file');
        if (!file) {
            return {
                error: 'No file provided'
            };
        }
        const uploadedFile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$file$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uploadRFQFile"])(supabase, {
            rfqId,
            file
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/rfqs/${rfqId}`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/my-rfqs/${rfqId}/edit`);
        return {
            file: uploadedFile
        };
    } catch (error) {
        console.error('Upload file error:', error);
        return {
            error: 'Failed to upload file'
        };
    }
}
async function deleteRFQFileAction(fileId, rfqId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$file$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteRFQFile"])(supabase, fileId);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/rfqs/${rfqId}`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/my-rfqs/${rfqId}/edit`);
        return {
            success: true
        };
    } catch (error) {
        console.error('Delete file error:', error);
        return {
            error: 'Failed to delete file'
        };
    }
}
async function listRFQFilesAction(rfqId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$file$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["listRFQFiles"])(supabase, rfqId);
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getSignedDownloadUrlAction,
    uploadRFQFileAction,
    deleteRFQFileAction,
    listRFQFilesAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getSignedDownloadUrlAction, "4029aca26fb6205270e4847cb7f5bf580062162bea", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(uploadRFQFileAction, "60b72f70a6a2f948f24887dfef2d6ecbbd876d7356", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteRFQFileAction, "60cd7fb70e977f3bec8a51109ce4075a4fb72df256", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(listRFQFilesAction, "405d7b43ad03e8ceaa96d76e19a8adbda8d1106e7f", null);
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
"[project]/features/rfq/services/rfq-service.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00a462aac4127515481f6e38d57b2671277b799c31":"getCategoriesAction","4018552473f8c624379e692f5362249985057ba4c3":"createRFQAction","409d452ca2b7db5191501a41903d05d473bb234ca8":"getRFQAction","40f0b76e927b7484bf3e73aff0757f84a5c962745c":"getMyRFQsAction","604c54a8b6f10058a22860a9dd9850bd5f62ff7f6a":"updateRFQStatusAction","60650d6502b3bca149ca55eaf8511c2bec17710098":"updateRFQAction","70c60d9fea72b86ef97943e8e537fc2b1bd98a6090":"getPublicRFQsAction"},"",""] */ __turbopack_context__.s([
    "createRFQAction",
    ()=>createRFQAction,
    "getCategoriesAction",
    ()=>getCategoriesAction,
    "getMyRFQsAction",
    ()=>getMyRFQsAction,
    "getPublicRFQsAction",
    ()=>getPublicRFQsAction,
    "getRFQAction",
    ()=>getRFQAction,
    "updateRFQAction",
    ()=>updateRFQAction,
    "updateRFQStatusAction",
    ()=>updateRFQStatusAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/entities/rfq/repo.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$company$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/entities/company/repo.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function getPublicRFQsAction(filters, page = 1, pageSize = 20) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["listPublicRFQs"])(supabase, filters, page, pageSize);
}
async function getMyRFQsAction(filters) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const company = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$company$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserPrimaryCompany"])(supabase, user.id);
    if (!company || !company.buyerEnabled) {
        throw new Error('No buyer company found');
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["listCompanyRFQs"])(supabase, company.id, filters);
}
async function getRFQAction(rfqId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRFQById"])(supabase, rfqId);
}
async function getCategoriesAction() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["listCategories"])(supabase);
}
async function createRFQAction(data) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        error: 'Not authenticated'
    };
    const company = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$company$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserPrimaryCompany"])(supabase, user.id);
    if (!company || !company.buyerEnabled) {
        return {
            error: 'No buyer company found'
        };
    }
    try {
        const rfq = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createRFQ"])(supabase, {
            ...data,
            companyId: company.id
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/my-rfqs');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/rfqs');
        return {
            rfqId: rfq.id
        };
    } catch (error) {
        console.error('Create RFQ error:', error);
        return {
            error: 'Failed to create RFQ'
        };
    }
}
async function updateRFQAction(rfqId, data) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateRFQ"])(supabase, rfqId, data);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/my-rfqs');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/rfqs/${rfqId}`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/rfqs');
        return {
            success: true
        };
    } catch (error) {
        console.error('Update RFQ error:', error);
        return {
            error: 'Failed to update RFQ'
        };
    }
}
async function updateRFQStatusAction(rfqId, status) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$entities$2f$rfq$2f$repo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateRFQStatus"])(supabase, rfqId, status);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/my-rfqs');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/rfqs/${rfqId}`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/rfqs');
        return {
            success: true
        };
    } catch (error) {
        console.error('Update RFQ status error:', error);
        return {
            error: 'Failed to update RFQ status'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getPublicRFQsAction,
    getMyRFQsAction,
    getRFQAction,
    getCategoriesAction,
    createRFQAction,
    updateRFQAction,
    updateRFQStatusAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPublicRFQsAction, "70c60d9fea72b86ef97943e8e537fc2b1bd98a6090", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getMyRFQsAction, "40f0b76e927b7484bf3e73aff0757f84a5c962745c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getRFQAction, "409d452ca2b7db5191501a41903d05d473bb234ca8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCategoriesAction, "00a462aac4127515481f6e38d57b2671277b799c31", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createRFQAction, "4018552473f8c624379e692f5362249985057ba4c3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateRFQAction, "60650d6502b3bca149ca55eaf8511c2bec17710098", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateRFQStatusAction, "604c54a8b6f10058a22860a9dd9850bd5f62ff7f6a", null);
}),
"[project]/.next-internal/server/app/(dashboard)/my-rfqs/new/page/actions.js { ACTIONS_MODULE0 => \"[project]/features/auth/services/auth-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/features/notification/services/notification-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/features/rfq/services/file-service.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/features/rfq/services/rfq-service.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$auth$2f$services$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/auth/services/auth-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$notification$2f$services$2f$notification$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/notification/services/notification-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$rfq$2f$services$2f$file$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/rfq/services/file-service.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$rfq$2f$services$2f$rfq$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/rfq/services/rfq-service.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/(dashboard)/my-rfqs/new/page/actions.js { ACTIONS_MODULE0 => \"[project]/features/auth/services/auth-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/features/notification/services/notification-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/features/rfq/services/file-service.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/features/rfq/services/rfq-service.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00340f65de870789f70e6e0b38bdc45b6da1e1f476",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$notification$2f$services$2f$notification$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markWinsSeenAction"],
    "003a75ea0cd6e302c7135b84fdefe8efe284d5f8c0",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$notification$2f$services$2f$notification$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markOffersSeenAction"],
    "00a10e1e61f983074205d47d08279ee38a4d1da496",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$notification$2f$services$2f$notification$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markRfqsSeenAction"],
    "00a462aac4127515481f6e38d57b2671277b799c31",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$rfq$2f$services$2f$rfq$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCategoriesAction"],
    "00bf7534dfdb838379ef7c4d22cb1a74ddd4f6a0ea",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$auth$2f$services$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logout"],
    "4018552473f8c624379e692f5362249985057ba4c3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$rfq$2f$services$2f$rfq$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createRFQAction"],
    "409d452ca2b7db5191501a41903d05d473bb234ca8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$rfq$2f$services$2f$rfq$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRFQAction"],
    "40f0b76e927b7484bf3e73aff0757f84a5c962745c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$rfq$2f$services$2f$rfq$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMyRFQsAction"],
    "604c54a8b6f10058a22860a9dd9850bd5f62ff7f6a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$rfq$2f$services$2f$rfq$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateRFQStatusAction"],
    "60650d6502b3bca149ca55eaf8511c2bec17710098",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$rfq$2f$services$2f$rfq$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateRFQAction"],
    "60b72f70a6a2f948f24887dfef2d6ecbbd876d7356",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$rfq$2f$services$2f$file$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uploadRFQFileAction"],
    "60cd7fb70e977f3bec8a51109ce4075a4fb72df256",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$rfq$2f$services$2f$file$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteRFQFileAction"],
    "70c60d9fea72b86ef97943e8e537fc2b1bd98a6090",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$rfq$2f$services$2f$rfq$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPublicRFQsAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$dashboard$292f$my$2d$rfqs$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$features$2f$auth$2f$services$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$features$2f$notification$2f$services$2f$notification$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$features$2f$rfq$2f$services$2f$file$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$features$2f$rfq$2f$services$2f$rfq$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(dashboard)/my-rfqs/new/page/actions.js { ACTIONS_MODULE0 => "[project]/features/auth/services/auth-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/features/notification/services/notification-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/features/rfq/services/file-service.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/features/rfq/services/rfq-service.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$auth$2f$services$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/auth/services/auth-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$notification$2f$services$2f$notification$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/notification/services/notification-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$rfq$2f$services$2f$file$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/rfq/services/file-service.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$rfq$2f$services$2f$rfq$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/rfq/services/rfq-service.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_b480a442._.js.map