<#
.SYNOPSIS
  Create a authorization code and subsequently an API Token for use with the Sonos API.

.PARAMETER ClientId
  https://integration.sonos.com/integrations
  Your Integration -> Credentials -> Client Credentials -> Key

.PARAMETER ClientSecret
  https://integration.sonos.com/integrations
  Your Integration -> Credentials -> Client Credentials -> Secret

.PARAMETER RedirectUri
  https://integration.sonos.com/integrations
  Your Integration -> Credentials -> Client Credentials -> Redirect URIs
  You can use whatever, the query parameters in the URL will reveal the auth code.
#>
param (
  [Parameter(Mandatory = $true)]
  [string] $ClientId,

  [Parameter(Mandatory = $true)]
  [string] $ClientSecret,

  [Parameter(Mandatory = $true)]
  [string] $RedirectUri,

  [string] $State = "whatever"
)

$RedirectUri = [System.Uri]::EscapeDataString($RedirectUri)
$basicAuthToken = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("$ClientId`:$ClientSecret"))

$oauthLoginUrl = "https://api.sonos.com/login/v3/oauth?client_id=$ClientId&response_type=code&state=$State&scope=playback-control-all&redirect_uri=$RedirectUri"

# kick off a browser, going to the Sonos login page
Start-Process $oauthLoginUrl

$authCode = Read-Host -Prompt "Enter authorization code from login:"

$apiTokenResponse = `
  Invoke-WebRequest `
  -Method POST `
  -Uri "https://api.sonos.com/login/v3/oauth/access" `
  -Headers @{"Authorization" = "Basic $basicAuthToken" } `
  -Body @{
    "grant_type"   = "authorization_code";
    "code"         = $authCode;
    "redirect_uri" = $RedirectUri;
  } `
  -ContentType "application/x-www-form-urlencoded"

Set-Clipboard $apiTokenResponse.Content

Write-host $apiTokenResponse.Content

Write-Host "The API Token is in your clipboard, paste it into /src/config.ts:bootstrappedSonosApiToken"
