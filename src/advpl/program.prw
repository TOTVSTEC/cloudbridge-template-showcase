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
	Local RetVal := Array(5)

	ConOut("OnReceivedMessage: " + content)

	RetVal[1] := "Message Received!"
	RetVal[2] := 1997
	RetVal[3] := .T.
	RetVal[4] := CToD("02/16/05")
	RetVal[5] := Array(2)
	RetVal[5][1] := "ProjectName"
	RetVal[5][2] := "<%= project.name %>"

	Return RetVal
Return


User Function <%= project.name %>()
Return
