#r "Newtonsoft.Json"
#load "./context.csx"

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;
using System.Xml.Linq;

// This is the main entry point for the script.
var scriptPath = Args[0];

// The context parameter contains information about the current request and response.
// Define the context values you want to use in the script.
ApimContext context = new ApimContext(scriptPath);

// Call the ExtractedScript method
var result = ExtractedScript(context);

// Write out the result
Console.WriteLine(result.toString());

// The extracted script returns a dynamic object to cater for different return types
// The named values are called nv_xxx which have been extracted from the script and replaced with variables
// Please check the script to ensure the string begins with a $ sign for string interpolation
private static dynamic ExtractedScript(ApimContext context)
{
	// The following named values have been extracted from the script and replaced with variables
	// Please check the script to ensure the string begins with a $ sign for string interpolation
	string nv_enc_key = ""; // Named Value: enc-key
	// ================== This is separator ==================

    
            var rng = new RNGCryptoServiceProvider();
            var iv = new byte[16];
            rng.GetBytes(iv);
            byte[] tokenBytes = Encoding.UTF8.GetBytes((string)(context.Variables.GetValueOrDefault<JObject>("token"))["access_token"]);
            byte[] encryptedToken = tokenBytes.Encrypt("Aes", Convert.FromBase64String("{nv_enc_key}"), iv);
            byte[] combinedContent = new byte[iv.Length + encryptedToken.Length];
            Array.Copy(iv, 0, combinedContent, 0, iv.Length);
            Array.Copy(encryptedToken, 0, combinedContent, iv.Length, encryptedToken.Length);
            return System.Net.WebUtility.UrlEncode(Convert.ToBase64String(combinedContent));
        
}        
