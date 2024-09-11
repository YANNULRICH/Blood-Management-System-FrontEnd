import forge from 'node-forge';
import {permut} from "./helpers";

export default class CryptoUtils {
    static simpleEncrypt = (str) => {
        let tab = str.split("");
        permut(tab, 0, 3);
        permut(tab, 2, 11);
        permut(tab, 4, 13);
        permut(tab, 6, 9);
        permut(tab, 8, 7);
        permut(tab, 10, 5);
        permut(tab, 14, 1);

        return tab.join("");
    };

    static simpleDecrypt = (str) => {
        let tab = str.split("");
        permut(tab, 3, 0);
        permut(tab, 11, 2);
        permut(tab, 13, 4);
        permut(tab, 9, 6);
        permut(tab, 7, 8);
        permut(tab, 5, 10);
        permut(tab, 1, 14);

        return tab.join("");
    };

    static sign = async (file, password, data) => {
        const privateKey = await this.getPrivateKey(file, password);
        const certificate = await this.getCertificate(file, password);
        const message = JSON.stringify(data);
        const md = forge.md.sha256.create();
        const pss = forge.pss.create({
            md: forge.md.sha256.create(),
            mgf: forge.mgf.mgf1.create(forge.md.sha256.create()),
            saltLength: 20,
        });
        md.update(message, 'utf8');
        return forge.util.encode64(privateKey.sign(md, 'RSASSA-PKCS1-V1_5'));
    };

    static encrypt = async (file, password, data) => {
        const certificate = await this.getCertificate(file, password);
        const message = JSON.stringify(data);
        const publicKey = await certificate.publicKey;
        const encryptData = await publicKey.encrypt(message, 'RSA-OAEP', {
            md: forge.md.sha256.create(),
            mgf1: {
                md: forge.md.sha1.create(),
            },
        });

        return forge.util.encode64(encryptData);
    };

    static decrypt = async (file, password, data) => {
        const encrypted = await forge.util.decode64(data);
        const privateKey = await this.getPrivateKey(file, password);
        const decrypteData = await privateKey.decrypt(encrypted, 'RSA-OAEP', {
            md: forge.md.sha256.create(),
            mgf1: {
                md: forge.md.sha1.create(),
            },
        });
        return decrypteData;
    };

    static verify = async (file, password, data, signature) => {
        const certificate = await this.getCertificate(file, password);
        const message = JSON.stringify({
            certInfo: this.getCertInfo(certificate),
            data,
        });
        const md = forge.md.sha512.create();
        const pss = forge.pss.create({
            md: forge.md.sha512.create(),
            mgf: forge.mgf.mgf1.create(forge.md.sha512.create()),
            saltLength: 20,
        });
        md.update(message, 'utf8');
        return certificate.publicKey.verify(
            md.digest().getBytes(),
            forge.util.decode64(signature),
            pss,
        );
    };

    static getCertInfos = (cert) => {
        return {
            signature_oid: cert.signatureOid,
            serial_number: cert.serialNumber,
            issuer_country: cert.issuer.attributes[0].value,
            issuer_organization: cert.issuer.attributes[1].value,
            issuer_organizational_unit: cert.issuer.attributes[2].value,
            issuer_common: cert.issuer.attributes[3].value,
            subject_country: cert.subject.attributes[0].value,
            subject_organization: cert.subject.attributes[1].value,
            subject_organizational_unit: cert.subject.attributes[2].value,
            subject_common: cert.subject.attributes[5].value,
        };
    };

    static convertFileToP12 = async (file, password) => {
        const byteFile = await getAsByteArray(file);
        const buffer = forge.util.createBuffer(byteFile);
        const p12Asn1 = forge.asn1.fromDer(buffer);
        return forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);
    };

    static getCertificate = async (file, password) => {
        const p12File = await this.convertFileToP12(file, password);
        const bags = p12File.getBags({bagType: forge.pki.oids.certBag});
        return bags[forge.pki.oids.certBag][0].cert;
    };

    static getPrivateKey = async (file, password) => {
        const p12File = await this.convertFileToP12(file, password);
        const bags = p12File.getBags({
            bagType: forge.pki.oids.pkcs12ShroudedKeyBag,
        });
        return bags[forge.pki.oids.pkcs12ShroudedKeyBag][0].key;
    };

    static getPrivatekeyPem = async (file, password) => {
        const privateKey = await this.getPrivateKey(file, password);
        return forge.pki.privateKeyToPem(privateKey);
    };

    static getCertificateBase64 = async (file, password) => {
        const certificatePem = await this.getCertificatePem(file, password);
        return forge.util.encode64(certificatePem);
    };

    static getCertificatePem = async (file, password) => {
        const certificate = await this.getCertificate(file, password);
        return forge.pki.certificateToPem(certificate);
    };
}

const getAsByteArray = async (file) => {
    return new Uint8Array(await readFileAsArrayBuffer(file));
};

const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
        // Create file reader
        let reader = new FileReader();

        // Register event listeners
        reader.addEventListener('loadend', (e) => resolve(e.target.result));
        reader.addEventListener('error', reject);

        // Read file
        reader.readAsArrayBuffer(file);
    });
};

export const base64ToFile = async (
    b64Data,
    contentType = 'file/pfx',
    sliceSize = 512,
) => {
    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);
        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new File(byteArrays, 'certifica', {type: contentType});
};

