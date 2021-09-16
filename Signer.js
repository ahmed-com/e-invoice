const chilkat = require('@chilkat/ck-node14-win64');

class Signer {
    constructor(){
        const cert = new chilkat.Cert()
        if(process.env.SCARDPIN){
            console.log("PIN used is :",process.env.SCARDPIN);
            cert.SmartCardPin = process.env.SCARDPIN;
        }
        const isCertLoaded = cert.LoadFromSmartcard("")
        if(isCertLoaded !== true) throw new Error(cert.LastErrorText)
        this.cert = cert;
    }

    signFile(jsonStr, signOptions) {
        if(!signOptions){
            signOptions = {contentType: 1, signingTime: 1, messageDigest: 1, signingCertificateV2: 1}
        }
        
        const crypt = this.getCrypt(this.cert, signOptions);
    
        const base64Sig = crypt.SignStringENC(jsonStr);
        if (crypt.LastMethodSuccess == false) throw new Error(crypt.LastErrorText);
    
        return base64Sig;
    }

    getCrypt(cert,options) {
        const crypt = new chilkat.Crypt2()
    
        const isCertSet = crypt.SetSigningCert(cert)
        if(isCertSet !== true) throw new Error(crypt.LastErrorText)
    
        const cmsOptions = new chilkat.JsonObject()
        cmsOptions.UpdateBool("DigestData",true);
        cmsOptions.UpdateBool("OmitAlgorithmIdNull",true);
        cmsOptions.UpdateBool("CanonicalizeITIDA",true);
        crypt.CmsOptions = cmsOptions.Emit()
    
        crypt.CadesEnabled = true
        crypt.HashAlgorithm = "sha256"
    
        const jsonSigningAttrs = new chilkat.JsonObject();
        jsonSigningAttrs.UpdateInt("contentType",options.contentType);
        jsonSigningAttrs.UpdateInt("signingTime",options.signingTime);
        jsonSigningAttrs.UpdateInt("messageDigest",options.messageDigest);
        jsonSigningAttrs.UpdateInt("signingCertificateV2",options.signingCertificateV2);
        crypt.SigningAttributes = jsonSigningAttrs.Emit();
    
        crypt.IncludeCertChain = options.includeCertChain || false;
        crypt.EncodingMode = options.encodingMode || "base64";
        crypt.Charset = options.charset || "utf-8";
    
        return crypt;
    }

}

module.exports = Signer;