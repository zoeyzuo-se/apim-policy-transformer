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
        
            try {
                string cookie = context.Request.Headers
                                            .GetValueOrDefault("Cookie")?
                                            .Split(';')
                                            .ToList()?
                                            .Where(p => p.Contains("{{cookie-name}}"))
                                            .FirstOrDefault()
                                            .Replace("{{cookie-name}}=", "");
                byte[] encryptedBytes = Convert.FromBase64String(System.Net.WebUtility.UrlDecode(cookie));
                byte[] iv = new byte[16];
                byte[] tokenBytes = new byte[encryptedBytes.Length - 16];
                Array.Copy(encryptedBytes, 0, iv, 0, 16);
                Array.Copy(encryptedBytes, 16, tokenBytes, 0, encryptedBytes.Length - 16);
                byte[] decryptedBytes = tokenBytes.Decrypt("Aes", Convert.FromBase64String("{{enc-key}}"), iv);
                char[] convertedBytesToChar = Encoding.UTF8.GetString(decryptedBytes).ToCharArray();
                return Encoding.UTF8.GetString(Encoding.UTF8.GetBytes(convertedBytesToChar));
            } catch (Exception ex) {
                return null;
            }
        
    }        
}