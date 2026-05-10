let admin;

const getFirebaseAdmin = () => {
    if (admin) return admin;

    admin = require('firebase-admin');

    if (admin.apps.length) return admin;

    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (serviceAccountJson) {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(serviceAccountJson))
        });
        return admin;
    }

    if (projectId && clientEmail && privateKey) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey: privateKey.replace(/\\n/g, '\n')
            })
        });
        return admin;
    }

    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });

    return admin;
};

const createFirebaseUser = async ({ email, password, displayName }) => {
    if (process.env.NODE_ENV === 'test') {
        return {
            uid: `test-firebase-${email}`
        };
    }

    return getFirebaseAdmin().auth().createUser({
        email,
        password,
        displayName
    });
};

const deleteFirebaseUser = async (uid) => {
    if (process.env.NODE_ENV === 'test') return;
    await getFirebaseAdmin().auth().deleteUser(uid);
};

module.exports = {
    createFirebaseUser,
    deleteFirebaseUser
};
