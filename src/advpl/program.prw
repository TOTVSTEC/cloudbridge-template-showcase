#include "cloudbridge.ch"

Class <%= project.name %> From CloudBridgeApp
	Data StartTime
	Data Started

	Method New() Constructor
	Method OnStart()
	Method OnLoadFinished(url)
	Method OnReceivedMessage(content)
EndClass

Method New() Class <%= project.name %>
	SELF:Started:= .F.
	SELF:StartTime:= Seconds()
Return

Method OnStart() Class <%= project.name %>
	SELF:WebView:navigate(SELF:RootPath + "index.html")
Return

Method OnLoadFinished(url) Class <%= project.name %>
	Local script
	Local loadTime

	If (!SELF:Started)
		SELF:Started:= .T.

		//If the load time is less than 3 seconds, await to hide the splash
		loadTime:= Max((Seconds() - SELF:StartTime), 0)

		if (loadTime < 3)
			Sleep((3 - loadTime) * 1000)
		Endif

		script := "var app = new App(" + AllTrim(Str(SELF:WSPort)) + ");"
		SELF:ExecuteJavaScript(script)
	EndIf
Return

Method OnReceivedMessage(content) Class <%= project.name %>
	Local RetVal := JSONObject():New()

	ConOut("OnReceivedMessage Received:")
	ConOut("  message: " + content:Get("message"))
	ConOut("  value: " + content:Get("value"))
	
	RetVal:Set("stringValue", "Message Received!")
	RetVal:Set("numberValue", 1997)
	RetVal:Set("booleanValue", .T.)
	RetVal:Set("dateValue", CToD("02/16/05"))
	RetVal:Set("nullValue", NIL)
	
	RetVal:Set("arrayValue", JSONArray():New())
	RetVal:Get("arrayValue"):Append(2016)
	RetVal:Get("arrayValue"):Append("CloudBridge")
	RetVal:Get("arrayValue"):Append(NIL)
	RetVal:Get("arrayValue"):Append(.T.)
	
	RetVal:Set("objectValue", JSONObject():New())
	RetVal:Get("objectValue"):Set("name", "<%= project.name %>")
	RetVal:Get("objectValue"):Set("id", "<%= project.id %>")

	Return RetVal
Return

User Function <%= project.name %>()
Return
