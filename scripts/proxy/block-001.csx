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
	string nv_cookie_name = ""; // Named Value: cookie-name
	string nv_enc_key = ""; // Named Value: enc-key
	// ================== This is separator ==================

    
            try {
                string cookie = context.Request.Headers
                                            .GetValueOrDefault("Cookie")?
                                            .Split(';')
                                            .ToList()?
                                            .Where(p => p.Contains("{nv_cookie_name}"))
                                            .FirstOrDefault()
                                            .Replace("{nv_cookie_name}=", "");
                byte[] encryptedBytes = Convert.FromBase64String(System.Net.WebUtility.UrlDecode(cookie));
                byte[] iv = new byte[16];
                byte[] tokenBytes = new byte[encryptedBytes.Length - 16];
                Array.Copy(encryptedBytes, 0, iv, 0, 16);
                Array.Copy(encryptedBytes, 16, tokenBytes, 0, encryptedBytes.Length - 16);
                byte[] decryptedBytes = tokenBytes.Decrypt("Aes", Convert.FromBase64String("{nv_enc_key}"), iv);
                char[] convertedBytesToChar = Encoding.UTF8.GetString(decryptedBytes).ToCharArray();
                return Encoding.UTF8.GetString(Encoding.UTF8.GetBytes(convertedBytesToChar));
            } catch (Exception ex) {
                return null;
            }
        
}        
