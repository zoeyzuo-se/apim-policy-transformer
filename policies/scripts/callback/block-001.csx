#r "Newtonsoft.Json"
#load "./_context.csx"

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

internal class Program
{
    static void Main(string[] args)
    {
        ApimContext context = new ApimContext();
        string result = Snippet(context);
        Console.WriteLine(result);
    }

    private static string Snippet(ApimContext context)
    {
        
            var rng = new RNGCryptoServiceProvider();
            var iv = new byte[16];
            rng.GetBytes(iv);
            byte[] tokenBytes = Encoding.UTF8.GetBytes((string)(context.Variables.GetValueOrDefault<JObject>("token"))["access_token"]);
            byte[] encryptedToken = tokenBytes.Encrypt("Aes", Convert.FromBase64String("{{enc-key}}"), iv);
            byte[] combinedContent = new byte[iv.Length + encryptedToken.Length];
            Array.Copy(iv, 0, combinedContent, 0, iv.Length);
            Array.Copy(encryptedToken, 0, combinedContent, iv.Length, encryptedToken.Length);
            return System.Net.WebUtility.UrlEncode(Convert.ToBase64String(combinedContent));
        
    }        
}