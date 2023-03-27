static string Method1() {
  
              var code = context.Request.MatchedParameters.GetValueOrDefault("place");
              var key = "{{google-geo-api-key}}";
              return $"https://maps.googleapis.com/maps/api/geocode/json?address={code}&key={key}";
              
}

static string Method2() {
  
              var loc = JObject.Parse((string)context.Variables["latlong=""
                                 lat=""
                                 lng=""
                           forecast=""/{{dark-sky-api-key}}/{lat},{lng}";
}

static string Method3() {
  context.Request.MatchedParameters.GetValueOrDefault("place", "")
}

static string Method4() {
  !context.Variables.ContainsKey("latlong=""")
}

static string Method5() {
  ((IResponse)context.Variables["response="""]).Body.As<JObject>
            ()["results"][0]["geometry"]["location"].ToString()
}

static string Method6() {
  context.Request.MatchedParameters.GetValueOrDefault("latlong=""")
}

static string Method7() {
  (string)context.Variables["latlong="""]
}