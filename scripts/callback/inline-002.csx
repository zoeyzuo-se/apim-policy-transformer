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
	// ================== This is separator ==================

    return context.Variables.GetValueOrDefault<IResponse>("response").Body.As<JObject>();
}        
