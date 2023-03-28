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
        return $"grant_type=authorization_code&amp;code={context.Request.OriginalUrl.Query.GetValueOrDefault("code")}&amp;client_id={{client-id}}&amp;client_secret={{client-secret}}&amp;redirect_uri=https://{context.Request.OriginalUrl.Host}/auth/callback";
    }        
}