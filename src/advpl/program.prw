#include "cloudbridge.ch"

Class <%= project.name %> From CloudBridgeApp
	Data StartTime

	Method New() Constructor
	Method OnStart()
	Method OnLoadFinished(url)
	Method OnReceivedMessage(content)
	
EndClass

Method New() Class <%= project.name %>
	SELF:StartTime:= Seconds()
Return

Method OnStart() Class <%= project.name %>
	SELF:WebView:navigate(SELF:RootPath + "index.html")
Return

Method OnLoadFinished(url) Class <%= project.name %>
	Local script
	Local loadTime
	
	script := "var app = new App(" + AllTrim(Str(SELF:WSPort)) + ");"
	SELF:ExecuteJavaScript(script)
	

	//If the load time is less than 3 seconds, await to hide the splash
	loadTime:= Max((Seconds() - SELF:StartTime), 0)

	if (loadTime < 3)
		Sleep((3 - loadTime) * 1000)
	Endif
	
	//Remove Splash Screen
	script := "var splash = document.getElementsByClassName('splash');"
	script += "if (splash.length > 0) {"
	script += "  splash[0].parentNode.removeChild(splash[0]);"
	script += "}"

	SELF:ExecuteJavaScript(script)
Return

Method OnReceivedMessage(content) Class <%= project.name %>
	Local RetVal := Array(5)

	ConOut("OnReceivedMessage: " + content)

	RetVal[1] := "Message Received!"
	RetVal[2] := 1997
	RetVal[3] := .T.
	RetVal[4] := CToD("02/16/05")
	RetVal[5] := Array(2)
	RetVal[5][1] := "Sub 1"
	RetVal[5][2] := "Sub 2"

	Return RetVal
Return


User Function <%= project.name %>()
Return