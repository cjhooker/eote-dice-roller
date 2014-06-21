Param(
  [switch]$release,
  [switch]$local
)

$DebugPreference = "Continue"

if ($release) {
	$source = "C:\Users\Chris Hooker\eote\eote-hangouts-dice-roller\"
	$destination = "C:\Users\Chris Hooker\eote\eote-hangouts-dice-roller-release\"
	$hangoutJs = "//plus.google.com/hangouts/_/api/v1/hangout.js"
	$basePath = "https://eote-hangouts-dice-roller-release.googlecode.com/git/"
} else {
	$source = "C:\Users\Chris Hooker\eote\eote-hangouts-dice-roller\"
	$destination = "C:\Users\Chris Hooker\eote\eote-hangouts-dice-roller-local\"
	$hangoutJs = "[[BASE_PATH]]js/fakes/hangout-fake.js"
	$basePath = ""
}

# First remove the destination if it exists. Then, get all the items to copy. Finally, create the destination.
# This order is important to make sure we don't try to copy the destination to itself if the destination is
# a subdirectory of the source
#if (test-path($destination)) { Remove-Item $destination -Recurse -Force }
#$items = get-childitem $source -recurse -exclude $excludes
#mkdir $destination > $null

# Remove everything from the destination
$items = get-childitem $destination
foreach ($item in $items)
{
	remove-item -path $item.FullName -recurse
}

# Copy everything from the source to the destination
$excludes = "*.ps1"
$items = get-childitem $source -recurse -exclude $excludes
foreach ($item in $items)
{
	$target = $item.FullName.Replace($source, $destination)
	copy-item -path $item.FullName -destination $target
}

# Loop through all the files and do replacements appropriate for this version
$appHtml = Get-Content ($destination + "app.html")
$includes = "*.html", "*.js", "*.css", "*.xml"
$files = Get-ChildItem -Path $destination -Recurse -Include $includes
foreach ($file in $files)
{
	#Write-Debug $file
	#Write-Debug $file.FullName
	(Get-Content $file.FullName) | 
	ForEach-Object { $_ -replace "\[\[APP_HTML\]\]", $appHtml } | 
	ForEach-Object { $_ -replace "\[\[HANGOUT_JS\]\]", $hangoutJs } | 
	ForEach-Object { $_ -replace "\[\[BASE_PATH\]\]", $basePath } | 
	Set-Content $file.FullName
}