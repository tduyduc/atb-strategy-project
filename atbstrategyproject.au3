; ATB Strategy Game Project by Tran Duy Duc （チャン・ズイ・ダ）
#include <ButtonConstants.au3>
#include <EditConstants.au3>
#include <GUIConstantsEx.au3>
#include <MsgBoxConstants.au3>
#include <ProgressConstants.au3>
#include <StaticConstants.au3>
#include <WindowsConstants.au3>
#include <Array.au3>
#include <GDIPlus.au3>
#include <GuiEdit.au3>
; Manhattan distance: d = abs(dx) + abs(dy)
; Properties of a character: HP, (MP), Atk, (Def), (Int), (Mnd), Atk Range, Atk Area, Spd, Mov
; In Game: Time determines the ATB bar filling progress; X/Y Coordinates
; Damage multiplier: 100 / (100 + Def) (as seen in League of Legends, 25 Def gives 80% Dmg)
; Play modes: 0 (Player vs. AI), 1 (AI vs. AI, GUI included), 2 (AI vs. AI, fast mode)
; AI modes: 0 (Random moves), 1 (Offensive), 2 (Ninja), 3 (Monte-Carlo), 4 (Minimax), 5 (Improved MC)
Global Enum $aiRandom, $aiOffensive, $aiNinja, $aiMonteCarlo, $aiMinimax, $aiImprovedMC ; AI modes
; Customizable: Battle Speed, Play Mode, AI Modes of Players, Team Members, Map Size
Global $BattleSpeed = 2, $PlayMode = 0, $AllyAIMode = $aiOffensive, $EnemyAIMode = $aiMonteCarlo
Global Const $TeamMembers = 3, $MapSize = 6, $TurnLimit = $TeamMembers * 10
Global $PlayerNames[2 * $TeamMembers], $PlayerStats[2 * $TeamMembers][9], $InGameStats[2 * $TeamMembers][11], _
		$TurnQueue[2 * $TeamMembers], $hCharacter[2 * $TeamMembers], $aiSearch[$TeamMembers], $queuers = 0, $TestingTurns = 0, _
		$BattleGUI, $hGraphic, $hImage, $hImage2, $hImage3, $hImage4, $region[$MapSize][$MapSize], $UnitsDispatched, _
		$InTurn = False, $moved = False, $attacked = False, $MarkAllies = False, $JustTesting = False, $turns = 0, _
		$nameDisplay[8], $hpDisplay[8], $maxhpDisplay[8], $mpDisplay[8], $atbBar[8], $aiTarget = -1, _
		$OriginalQueue, $OriginalStats, $OriginalQueuers, $OriginalTarget, $OriginalSearch, $OriginalInactiveTurns, _
		$gTotal, $InactiveTurns = 0, $aiMode = 0
; First dimension denotes player index; Second dimension denotes property as enumerated, with the 9th being class index or waiting time
; Player indexes 8–15 are used for enemies
; If multiple players has got their ATB bar full while a command is being taken, the queue is used
Global Enum $tAction, $tX, $tY, $tScore, $tParent ; Tree node properties
Global Enum $hp, $mp, $atk, $def, $rng, $area, $spd, $mov, $time, $x, $y ; Character properties
Global Enum $Fighter, $BlBelt, $Archer, $Assassin, $Bomber, $WMage, $BMage, $TMage ; Classes
Global Const $properties[8] = ["HP", "MP", "Attack", "Defense", "Range", "Area", "Speed", "Move"]
Global Const $AutoNames[8][3] = [ _ ; Automatic names for each class
		["Cyan", "Firion", "Cecil"], _
		["Sabin", "Yang", "Galuf"], _
		["Edgar", "Ceodore", "Edward"], _
		["Shadow", "Edge", "Jinnai"], _
		["Relm", "Krile", "Matoya"], _
		["Terra", "Rosa", "Refia"], _
		["Celes", "Rydia", "Alba"], _
		["Strago", "Leon", "Palom"] ]
Global Const $sprites[8] = ["cyan.gif", "sabin.gif", "edgar.gif", "shadow.gif", "relm.gif", "terra.gif", "celes.gif", "strago.gif"]
Global Const $classes[8][9] = [ _ ; Initial properties for each class
		[500,	20,		30,	45,	1,	0,	40,	2,	"Fighter"], _
		[400,	25,		70, 30,	1,	0,	25,	2,	"Black Belt"], _
		[300,	30,		30,	15,	3,	0,	35,	2,	"Archer"], _
		[250,	20,		45,	15,	1,	0,	80,	3,	"Assassin"], _
		[300,	35,		30,	15,	2,	1,	30,	2,	"Bomber"], _
		[300,	100,	20,	15,	1,	0,	30,	1,	"White Mage"], _
		[300,	200,	20,	15,	1,	0,	30,	1,	"Black Mage"], _
		[300,	40,		20,	15,	1,	0,	30,	1,	"Time Mage"] ]
		; HP,	MP,		At,	Df,	R,	A,	Sp,	M,	Class Name
Global Const $backgrounds[] = ["grass.jpg", "sea.jpg", "meadow.jpg", "hill.jpg", "storm.jpg"], _
		$BattleBackground = Random(0, UBound($backgrounds) - 1, 1), $MaxTime = 10000

AutoItSetOption("TrayIconDebug", 1)
_GDIPlus_Startup()
OnAutoItExitRegister("OnExit")
ClassSelect()
DispatchUnits()
BattleScreen()

Func ClassSelect() ; Select 8 unit classes before entering the battle
	Local $SelectButton[8]
	If $PlayMode = 0 Then
		For $i = 0 To $TeamMembers - 1
			$CharSelectGUI = GUICreate("Class Select: Character " & $i + 1, 890 - 330, 260)
			GUISetFont(8.5, 0, 0, "Tahoma")
			; GUICtrlCreateLabel("Character Name", 460, 12, 150, 19, $SS_RIGHT)
			$CharNameInput = GUICtrlCreateInput("", 615 - 330, 8, 130, 25)
			$AutoNameButton = GUICtrlCreateButton("Auto-Name", 750 - 330, 8, 130, 25)
			$ResetButton = GUICtrlCreateButton("Reset All", 8, 8, 130, 25)
			$BackButton = GUICtrlCreateButton("Back", 145, 8, 130, 25)
			If $i = 0 Then GUICtrlSetState($BackButton, $GUI_DISABLE)
			For $j = $Fighter To $Bomber
				GUICtrlCreateGroup($classes[$j][8], 8 + $j * 110, 40, 100, 210)
				For $k = $hp To $mov
					GUICtrlCreateLabel($properties[$k], 16 + $j * 110, 59 + $k * 20, 45, 17)
					GUICtrlCreateLabel($classes[$j][$k], 74 + $j * 110, 59 + $k * 20, 25, 17, $SS_RIGHT)
				Next
				$SelectButton[$j] = GUICtrlCreateButton("Select", 16 + $j * 110, 59 + 8 * 20, 45, 24)
				GUICtrlCreatePic("res\" & $sprites[$j], 83 + $j * 110, 59 + 8 * 20, 16, 24, $SS_RIGHT)
				GUICtrlCreateGroup("", -99, -99, 1, 1)
			Next
			GUISetState(@SW_SHOW)
			While 1
				$nMsg = GUIGetMsg()
				Switch $nMsg
					Case $GUI_EVENT_CLOSE
						QuitConfirmation()
					Case $AutoNameButton
						GUICtrlSetData($CharNameInput, $AutoNames[Random($Fighter, $TMage, 1)][Random(0, 2, 1)])
					Case $ResetButton
						GUIDelete()
						$i = -1
						ExitLoop
					Case $BackButton
						GUIDelete()
						$i -= 2
						ExitLoop
					Case Else
						For $j = $Fighter To $Bomber
							If $nMsg = $SelectButton[$j] Then
								$PlayerStats[$i][$time] = $j
								$PlayerNames[$i] = GUICtrlRead($CharNameInput) ? GUICtrlRead($CharNameInput) : $AutoNames[$j][Random(0, 2, 1)]
								For $k = $hp To $mov
									$PlayerStats[$i][$k] = $classes[$j][$k]
									$InGameStats[$i][$k] = $PlayerStats[$i][$k]
								Next
								$InGameStats[$i][$x] = -1
								$InGameStats[$i][$y] = -1
								GUIDelete()
								; ShowInformation($i)
								ExitLoop 2
							EndIf
						Next
				EndSwitch
			WEnd
		Next
	Else
		For $i = 0 To $TeamMembers ; Random classes for AI 1
			$PlayerStats[$i][$time] = Random($Fighter, $Bomber, 1)
			$PlayerNames[$i] = $classes[$PlayerStats[$i][$time]][8] & " " & $i + 1
			For $k = $hp To $mov
				$PlayerStats[$i][$k] = $classes[$PlayerStats[$i][$time]][$k]
				$InGameStats[$i][$k] = $PlayerStats[$i][$k]
			Next
			$InGameStats[$i][$x] = -1
			$InGameStats[$i][$y] = -1
		Next
	EndIf
	For $i = $TeamMembers To 2 * $TeamMembers - 1 ; For balance, the computer has the same class lineup
		$PlayerStats[$i][$time] = $PlayerStats[$i - $TeamMembers][$time]
		$PlayerNames[$i] = $classes[$PlayerStats[$i][$time]][$time] & " " & $i + 1 - ($PlayMode ? 0 : $TeamMembers)
		For $k = $hp To $mov
			$PlayerStats[$i][$k] = $classes[$PlayerStats[$i][$time]][$k]
			$InGameStats[$i][$k] = $PlayerStats[$i][$k]
		Next
		$InGameStats[$i][$x] = -1
		$InGameStats[$i][$y] = -1
	Next
EndFunc

Func DispatchUnits() ; Select initial location for characters
    For $i = 0 To $MapSize - 1
		For $j = 0 To $MapSize - 1
			$region[$i][$j] = ($i > $MapSize - 3)
		Next
	Next
	$BattleGUI = GUICreate("Unit Dispatch", $MapSize * 32, $MapSize * 32, 100, 100)
	$hImage = _GDIPlus_ImageLoadFromFile("res\" & $backgrounds[$BattleBackground])
	$hImage2 = _GDIPlus_ImageLoadFromFile("res\grid.png")
	$hImage3 = _GDIPlus_ImageLoadFromFile("res\box.png")
	$hImage4 = _GDIPlus_ImageLoadFromFile("res\selection.png")
	$hGraphic = _GDIPlus_GraphicsCreateFromHWND($BattleGUI)
	For $i = 0 To 2 * $TeamMembers - 1
		$hCharacter[$i] = _GDIPlus_ImageLoadFromFile("res\" & $sprites[$PlayerStats[$i][$time]])
	Next
	RedrawWindow()
	If $PlayMode <> 2 Then GUISetState(@SW_SHOW, $BattleGUI)
	$UnitsDispatched = 0
	While $UnitsDispatched < $TeamMembers
		If $PlayMode = 0 Then
			$DispatchGUI = GUICreate($UnitsDispatched + 1, 180, 230, 650, 200)
			GUISetFont(8.5, 0, 0, "Tahoma")
			GUICtrlCreateLabel("Click on a shaded square to select location for " & $PlayerNames[$UnitsDispatched] & ".", 8, 8, 164, 30)
			GUICtrlCreateGroup($classes[$PlayerStats[$UnitsDispatched][$time]][8], 8, 40, 100, 185)
			For $k = $hp To $mov
				GUICtrlCreateLabel($properties[$k], 16, 59 + $k * 20, 45, 17)
				GUICtrlCreateLabel($classes[$PlayerStats[$UnitsDispatched][$time]][$k], 74, 59 + $k * 20, 25, 17, $SS_RIGHT)
			Next
			GUICtrlCreateGroup("", -99, -99, 1, 1)
			; GUICtrlCreatePic("res\" & $sprites[$PlayerStats[$UnitsDispatched][$time]], 135, 60, 16, 24, $SS_RIGHT)
			$ResetButton = GUICtrlCreateButton("Reset", 115, 110, 55, 25)
			$BackButton = GUICtrlCreateButton("Back", 115, 145, 55, 25)
			If $UnitsDispatched = 0 Then GUICtrlSetState(-1, $GUI_DISABLE)
			RedrawWindow()
			GUISetState(@SW_SHOW, $DispatchGUI)
			While 1
				$nMsg = GUIGetMsg(1)
				If Not IsArray($nMsg) Then ContinueLoop
				If $nMsg[0] = $GUI_EVENT_CLOSE Then QuitConfirmation()
				Switch $nMsg[1]
					Case $BattleGUI
						If ($nMsg[0] = $GUI_EVENT_PRIMARYDOWN) And ($nMsg[3] >= 0) And ($nMsg[3] < $MapSize * 32) _
								And ($nMsg[4] >= 0) And ($nMsg[4] < $MapSize * 32) Then
							If $region[Int($nMsg[3] / 32)][Int($nMsg[4] / 32)] Then
								$InGameStats[$UnitsDispatched][$x] = Int($nMsg[3] / 32)
								$InGameStats[$UnitsDispatched][$y] = Int($nMsg[4] / 32)
								$region[Int($nMsg[3] / 32)][Int($nMsg[4] / 32)] = False
								GUIDelete($DispatchGUI)
								ExitLoop
							EndIf
						EndIf
					Case $DispatchGUI
						Switch $nMsg[0]
							Case $ResetButton
								GUIDelete($DispatchGUI)
								$UnitsDispatched = 0
								For $i = $MapSize - 2 To $MapSize - 1
									For $j = 0 To $MapSize - 1
										$region[$i][$j] = True
									Next
								Next
								ContinueLoop 2
							Case $BackButton
								GUIDelete($DispatchGUI)
								$UnitsDispatched -= 1
								$region[$InGameStats[$UnitsDispatched][$x]][$InGameStats[$UnitsDispatched][$y]] = True
								$InGameStats[$UnitsDispatched][$x] = -1
								$InGameStats[$UnitsDispatched][$y] = -1
								ContinueLoop 2
						EndSwitch
				EndSwitch
			WEnd
		Else ; Random lineup for AI 1
			Do
				$InGameStats[$UnitsDispatched][$x] = Random($MapSize - 2, $MapSize - 1, 1)
				$InGameStats[$UnitsDispatched][$y] = Random(0, $MapSize - 1, 1)
				$matched = True
				For $j = 0 To $UnitsDispatched - 1
					If ($InGameStats[$UnitsDispatched][$x] = $InGameStats[$j][$x]) And _
							($InGameStats[$UnitsDispatched][$y] = $InGameStats[$j][$y]) Then $matched = False
				Next
			Until $matched
		EndIf
		$UnitsDispatched += 1
	WEnd
	Local $matched
	While $UnitsDispatched < 2 * $TeamMembers ; Assume that the computer has a random lineup
		Do
			$InGameStats[$UnitsDispatched][$x] = Random(0, 1, 1)
			$InGameStats[$UnitsDispatched][$y] = Random(0, $MapSize - 1, 1)
			$matched = True
			For $j = $TeamMembers To $UnitsDispatched - 1
				If ($InGameStats[$UnitsDispatched][$x] = $InGameStats[$j][$x]) And _
						($InGameStats[$UnitsDispatched][$y] = $InGameStats[$j][$y]) Then $matched = False
			Next
		Until $matched
		$UnitsDispatched += 1
	WEnd
	WinSetTitle($BattleGUI, "", "Battle Scene")
	ResetRegions()
	RedrawWindow()
EndFunc

Func BattleScreen()
	Local $matched
	ResetRegions()
	For $i = 0 To 2 * $TeamMembers - 1
		$InGameStats[$i][$time] = Random(0, 5000, 1)
		$TurnQueue[$i] = -1
	Next
	$CommandGUI = GUICreate("Status & Commands", 624, 335, -1, 200)
	GUISetFont(8.5, 0, 0, "Tahoma")
	GUICtrlCreateGroup("Battle Log", 8, 8, 225, 320)
	Global $BattleLog = GUICtrlCreateEdit("", 16, 24, 209, 295, BitOR($WS_VSCROLL, $ES_MULTILINE, $ES_READONLY, $ES_AUTOVSCROLL))
	_GUICtrlEdit_AppendText($BattleLog, "Are you ready? Push Start button to begin the battle." & @CRLF)
	GUICtrlCreateGroup("", -99, -99, 1, 1)
	GUICtrlCreateGroup("Status", 240, 8, 377, 183)
	For $i = 0 To Min(7, 2 * $TeamMembers + 1)
		Switch $i
			Case 2 * $TeamMembers
				$hpDisplay[$i] = GUICtrlCreateLabel("HP", 376, 24 + $i * 20, 46, 17, $SS_RIGHT)
				$mpDisplay[$i] = GUICtrlCreateLabel("MP", 478, 24 + $i * 20, 36, 17, $SS_RIGHT)
				$atbBar[$i] = GUICtrlCreateLabel("Time/Turns", 520, 24 + $i * 20, 89, 17, $SS_RIGHT)
			Case 2 * $TeamMembers + 1
				$nameDisplay[$i] = GUICtrlCreateLabel("Inactive Turns", 248, 24 + $i * 20, 107, 17)
				$hpDisplay[$i] = GUICtrlCreateLabel($InactiveTurns & " /", 376, 24 + $i * 20, 46, 17, $SS_RIGHT)
				$maxhpDisplay[$i] = GUICtrlCreateLabel($TurnLimit, 424, 24 + $i * 20, 36, 17, $SS_RIGHT)
				$atbBar[$i] = GUICtrlCreateLabel($turns, 520, 24 + $i * 20, 89, 17, $SS_RIGHT)
			Case Else
				$nameDisplay[$i] = GUICtrlCreateLabel($PlayerNames[$i], 248, 24 + $i * 20, 107, 17)
				$hpDisplay[$i] = GUICtrlCreateLabel($InGameStats[$i][$hp] & " /", 376, 24 + $i * 20, 46, 17, $SS_RIGHT)
				$maxhpDisplay[$i] = GUICtrlCreateLabel($PlayerStats[$i][$hp], 424, 24 + $i * 20, 36, 17, $SS_RIGHT)
				$mpDisplay[$i] = GUICtrlCreateLabel($InGameStats[$i][$mp], 478, 24 + $i * 20, 36, 17, $SS_RIGHT)
				$atbBar[$i] = GUICtrlCreateProgress(520, 24 + $i * 20, 89, 17, $PBS_SMOOTH)
		EndSwitch
	Next
	GUICtrlCreateGroup("", -99, -99, 1, 1)
	GUICtrlCreateGroup("Commands", 240, 196, 377, 131)
	Global $EndTurnButton = GUICtrlCreateButton("End Turn", 448, 214, 89, 25)
	GUICtrlSetState(-1, $GUI_DISABLE)
	Global $PauseButton = GUICtrlCreateButton("Start", 544, 214, 65, 25, $BS_DEFPUSHBUTTON)
	Global $CurrentLabel = GUICtrlCreateLabel("Push Start or 5", 248, 216, 106, 17)
	Global $Ability1 = GUICtrlCreateButton("Move", 248, 240, 73, 25)
	GUICtrlSetState(-1, $GUI_DISABLE)
	Global $Ability2 = GUICtrlCreateButton("Attack", 248, 266, 73, 25)
	GUICtrlSetState(-1, $GUI_DISABLE)
	Global $Ability3 = GUICtrlCreateButton("Ability", 248, 292, 73, 25)
	GUICtrlSetState(-1, $GUI_DISABLE)
	Global $Tooltip1 = GUICtrlCreateLabel("Hotkeys:", 328, 246, 284, 17)
	Global $Tooltip2 = GUICtrlCreateLabel("1, 2, 3 for commands/abilities", 328, 272, 284, 17)
	Global $Tooltip3 = GUICtrlCreateLabel("4 for End Turn, 5 for Pause", 328, 298, 284, 17)
	GUICtrlCreateGroup("", -99, -99, 1, 1)
	Local Const $accelerators[][] = [ _
			["1", $Ability1], ["2", $Ability2], ["3", $Ability3], ["4", $EndTurnButton], ["5", $PauseButton], _
			["{numpad1}", $Ability1], ["{numpad2}", $Ability2], ["{numpad3}", $Ability3], _
			["{numpad4}", $EndTurnButton], ["{numpad5}", $PauseButton] ]
	GUISetAccelerators($accelerators, $BattleGUI)
	GUISetAccelerators($accelerators, $CommandGUI)
	GUISetState(@SW_SHOW, $CommandGUI)
	If $PlayMode <> 2 Then
		Do
			$nMsg = GUIGetMsg()
			If $nMsg = $GUI_EVENT_CLOSE Then QuitConfirmation()
		Until $nMsg = $PauseButton
	Else
		GUICtrlSetState($PauseButton, $GUI_DISABLE)
		AutoItSetOption("GUIOnEventMode", 1)
		GUISetOnEvent($GUI_EVENT_CLOSE, "QuitConfirmation")
	EndIf
	GUICtrlSetData($PauseButton, "Pause")
	GUICtrlSetData($CurrentLabel, "")
	GUICtrlSetData($Tooltip1, "")
	GUICtrlSetData($Tooltip2, "")
	GUICtrlSetData($Tooltip3, "")
	While ($PlayMode = 2) ? 1 : Sleep(10 * $BattleSpeed)
		If Annihilated(0) Then
			If Annihilated(1) Then
				_GUICtrlEdit_AppendText($BattleLog, "It's a tie!" & @CRLF)
				If $PlayMode = 2 Then Exit 103
			Else
				_GUICtrlEdit_AppendText($BattleLog, "You lost! Better luck next time!" & @CRLF)
				If $PlayMode = 2 Then Exit 102
			EndIf
			GameOver()
		ElseIf Annihilated(1) Then
			_GUICtrlEdit_AppendText($BattleLog, "You won! Congratulations!" & @CRLF)
			If $PlayMode = 2 Then Exit 101
			GameOver()
		EndIf
		If WinActive($BattleGUI) Or WinActive($CommandGUI) Or ($PlayMode <> 0) Then TimePasses()
		If $PlayMode = 2 Then ContinueLoop
		$nMsg = GUIGetMsg(1)
		If Not IsArray($nMsg) Then ContinueLoop
		If $nMsg[0] = $GUI_EVENT_CLOSE Then QuitConfirmation()
		If $nMsg[1] = $CommandGUI Then
			Switch $nMsg[0]
				Case $PauseButton
					PauseBattle()
				Case $EndTurnButton
					CompleteTurn()
				Case $Ability1
					GUICtrlSetData($CurrentLabel, "Move: " & $InGameStats[$TurnQueue[0]][$mov])
					GUICtrlSetData($EndTurnButton, "Cancel")
					GUICtrlSetData($Ability1, "")
					GUICtrlSetData($Ability2, "")
					GUICtrlSetData($Ability3, "")
					GUICtrlSetState($Ability1, $GUI_DISABLE)
					GUICtrlSetState($Ability2, $GUI_DISABLE)
					GUICtrlSetState($Ability3, $GUI_DISABLE)
					GUICtrlSetData($Tooltip1, "Click on the destination to move")
					GUICtrlSetData($Tooltip2, "")
					GUICtrlSetData($Tooltip3, "")
					For $i = 0 To $MapSize - 1
						For $j = 0 To $MapSize - 1
							$matched = True
							For $k = 0 To 2 * $TeamMembers - 1
								If ($InGameStats[$k][$x] = $i) And ($InGameStats[$k][$y] = $j) Then
									$matched = False
									ExitLoop
								EndIf
							Next
							$region[$i][$j] = $matched And (Distance($i, $j, _
									$InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y]) <= $InGameStats[$TurnQueue[0]][$mov])
						Next
					Next
					$MarkAllies = True
					RedrawWindow()
					While 1
						$nMsg = GUIGetMsg(1)
						If Not IsArray($nMsg) Then ContinueLoop
						If $nMsg[0] = $GUI_EVENT_CLOSE Then QuitConfirmation()
						Switch $nMsg[1]
							Case $CommandGUI
								Switch $nMsg[0]
									Case $PauseButton
										PauseBattle()
									Case $EndTurnButton
										$MarkAllies = False
										ResetRegions()
										RedrawWindow()
										InitializeCommands()
										ContinueLoop 2
								EndSwitch
							Case $BattleGUI
								If ($nMsg[0] = $GUI_EVENT_PRIMARYDOWN) And ($nMsg[3] >= 0) And _
										($nMsg[3] < $MapSize * 32) And ($nMsg[4] >= 0) And ($nMsg[4] < $MapSize * 32) And _
										$region[Int($nMsg[3] / 32)][Int($nMsg[4] / 32)] Then
									$MarkAllies = False
									ResetRegions()
									MoveCharacter(Int($nMsg[3] / 32), Int($nMsg[4] / 32))
									InitializeCommands()
									ContinueLoop 2
								EndIf
						EndSwitch
					WEnd
				Case $Ability2
					GUICtrlSetData($CurrentLabel, "Attack: " & $InGameStats[$TurnQueue[0]][$atk])
					GUICtrlSetData($EndTurnButton, "Cancel")
					GUICtrlSetData($Ability1, "")
					GUICtrlSetData($Ability2, "")
					GUICtrlSetData($Ability3, "")
					GUICtrlSetState($Ability1, $GUI_DISABLE)
					GUICtrlSetState($Ability2, $GUI_DISABLE)
					GUICtrlSetState($Ability3, $GUI_DISABLE)
					GUICtrlSetData($Tooltip1, "Click on the target to attack")
					GUICtrlSetData($Tooltip2, "")
					GUICtrlSetData($Tooltip3, "")
					For $i = 0 To $MapSize - 1
						For $j = 0 To $MapSize - 1
							$region[$i][$j] = (Distance($i, $j, _
									$InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y]) <= $InGameStats[$TurnQueue[0]][$rng])
						Next
					Next
					$MarkAllies = True
					RedrawWindow()
					While 1
						$nMsg = GUIGetMsg(1)
						If Not IsArray($nMsg) Then ContinueLoop
						If $nMsg[0] = $GUI_EVENT_CLOSE Then QuitConfirmation()
						Switch $nMsg[1]
							Case $CommandGUI
								Switch $nMsg[0]
									Case $PauseButton
										PauseBattle()
									Case $EndTurnButton
										$MarkAllies = False
										ResetRegions()
										RedrawWindow()
										InitializeCommands()
										ContinueLoop 2
								EndSwitch
							Case $BattleGUI
								If ($nMsg[0] = $GUI_EVENT_PRIMARYDOWN) And ($nMsg[3] >= 0) And _
										($nMsg[3] < $MapSize * 32) And ($nMsg[4] >= 0) And ($nMsg[4] < $MapSize * 32) And _
										$region[Int($nMsg[3] / 32)][Int($nMsg[4] / 32)] Then
									$MarkAllies = False
									ResetRegions()
									AttackCharacter(Int($nMsg[3] / 32), Int($nMsg[4] / 32))
									InitializeCommands()
									ContinueLoop 2
								EndIf
						EndSwitch
					WEnd
				Case $Ability3
					ContinueLoop
					GUICtrlSetData($CurrentLabel, "MP: " & $InGameStats[$TurnQueue[0]][$mp] & " / " & $PlayerStats[$TurnQueue[0]][$mp])
					GUICtrlSetData($EndTurnButton, "Cancel")
					Switch $PlayerStats[$TurnQueue[0]][$time]
						Case $Fighter
							GUICtrlSetData($Ability1, "Temper")
							GUICtrlSetData($Ability2, "")
							GUICtrlSetData($Ability3, "")
							If $InGameStats[$TurnQueue[0]][$mp] < 1 Then GUICtrlSetState($Ability1, $GUI_DISABLE)
							GUICtrlSetState($Ability2, $GUI_DISABLE)
							GUICtrlSetState($Ability3, $GUI_DISABLE)
							GUICtrlSetData($Tooltip1, "(1 MP) Attack with more damage")
							GUICtrlSetData($Tooltip2, "")
							GUICtrlSetData($Tooltip3, "")
						Case $BlBelt
							GUICtrlSetData($Ability1, "Focus")
							GUICtrlSetData($Ability2, "")
							GUICtrlSetData($Ability3, "")
							If $InGameStats[$TurnQueue[0]][$mp] < 1 Then GUICtrlSetState($Ability1, $GUI_DISABLE)
							GUICtrlSetState($Ability2, $GUI_DISABLE)
							GUICtrlSetState($Ability3, $GUI_DISABLE)
							GUICtrlSetData($Tooltip1, "(1 MP) Reduces movement range (2) for more damage")
							GUICtrlSetData($Tooltip2, "")
							GUICtrlSetData($Tooltip3, "")
						Case $Archer
							GUICtrlSetData($Ability1, "Aim")
							GUICtrlSetData($Ability2, "")
							GUICtrlSetData($Ability3, "")
							If $InGameStats[$TurnQueue[0]][$mp] < 1 Then GUICtrlSetState($Ability1, $GUI_DISABLE)
							GUICtrlSetState($Ability2, $GUI_DISABLE)
							GUICtrlSetState($Ability3, $GUI_DISABLE)
							GUICtrlSetData($Tooltip1, "(1 MP) Decreases attack range (3), increases damage")
							GUICtrlSetData($Tooltip2, "")
							GUICtrlSetData($Tooltip3, "")
						Case $Assassin
							GUICtrlSetData($Ability1, "Blink")
							GUICtrlSetData($Ability2, "")
							GUICtrlSetData($Ability3, "")
							If $InGameStats[$TurnQueue[0]][$mp] < 1 Then GUICtrlSetState($Ability1, $GUI_DISABLE)
							GUICtrlSetState($Ability2, $GUI_DISABLE)
							GUICtrlSetState($Ability3, $GUI_DISABLE)
							GUICtrlSetData($Tooltip1, "(1 MP) Increases movement range (6)")
							GUICtrlSetData($Tooltip2, "")
							GUICtrlSetData($Tooltip3, "")
						Case $Bomber
							GUICtrlSetData($Ability1, "Flare")
							GUICtrlSetData($Ability2, "")
							GUICtrlSetData($Ability3, "")
							If $InGameStats[$TurnQueue[0]][$mp] < 1 Then GUICtrlSetState($Ability1, $GUI_DISABLE)
							GUICtrlSetState($Ability2, $GUI_DISABLE)
							GUICtrlSetState($Ability3, $GUI_DISABLE)
							GUICtrlSetData($Tooltip1, "(1 MP) Exchanges attack range (1) for damage area (2)")
							GUICtrlSetData($Tooltip2, "")
							GUICtrlSetData($Tooltip3, "")
						Case $WMage
							GUICtrlSetData($Ability1, "Cure")
							GUICtrlSetData($Ability2, "Dispel")
							GUICtrlSetData($Ability3, "Heal")
							If $InGameStats[$TurnQueue[0]][$mp] < 1 Then GUICtrlSetState($Ability1, $GUI_DISABLE)
							If $InGameStats[$TurnQueue[0]][$mp] < 2 Then GUICtrlSetState($Ability2, $GUI_DISABLE)
							If $InGameStats[$TurnQueue[0]][$mp] < 3 Then GUICtrlSetState($Ability3, $GUI_DISABLE)
							GUICtrlSetData($Tooltip1, "(1 MP) Restores HP for one ally")
							GUICtrlSetData($Tooltip2, "(2 MP) Removes all debuffs for one ally")
							GUICtrlSetData($Tooltip3, "(3 MP) Restores HP for all allies")
						Case $BMage
							GUICtrlSetData($Ability1, "Fire")
							GUICtrlSetData($Ability2, "Blizzard")
							GUICtrlSetData($Ability3, "Thunder")
							If $InGameStats[$TurnQueue[0]][$mp] < 2 Then GUICtrlSetState($Ability1, $GUI_DISABLE)
							If $InGameStats[$TurnQueue[0]][$mp] < 3 Then GUICtrlSetState($Ability2, $GUI_DISABLE)
							If $InGameStats[$TurnQueue[0]][$mp] < 5 Then GUICtrlSetState($Ability3, $GUI_DISABLE)
							GUICtrlSetData($Tooltip1, "(2 MP) Damages one enemy")
							GUICtrlSetData($Tooltip2, "(3 MP) Damages a wide area (2)")
							GUICtrlSetData($Tooltip3, "(5 MP) Damages all enemies")
						Case $TMage
							GUICtrlSetData($Ability1, "Meteor")
							GUICtrlSetData($Ability2, "Slow")
							GUICtrlSetData($Ability3, "Break")
							If $InGameStats[$TurnQueue[0]][$mp] < 1 Then GUICtrlSetState($Ability1, $GUI_DISABLE)
							If $InGameStats[$TurnQueue[0]][$mp] < 1 Then GUICtrlSetState($Ability2, $GUI_DISABLE)
							If $InGameStats[$TurnQueue[0]][$mp] < 1 Then GUICtrlSetState($Ability3, $GUI_DISABLE)
							GUICtrlSetData($Tooltip1, "(1 MP) Damages a random enemy, might miss")
							GUICtrlSetData($Tooltip2, "(1 MP) Reduces speed of one enemy by 25%")
							GUICtrlSetData($Tooltip3, "(1 MP) Reduces defense of one enemy by 10")
					EndSwitch
					While 1
						$nMsg = GUIGetMsg()
						If $nMsg = $GUI_EVENT_CLOSE Then QuitConfirmation()
						Switch $nMsg
							Case $PauseButton
								PauseBattle()
							Case $EndTurnButton
								RedrawWindow()
								InitializeCommands()
								ContinueLoop 2
							Case $Ability1
								Switch $PlayerStats[$TurnQueue[0]][$time]
									Case $Fighter ; Temper
									Case $BlBelt ; Focus
									Case $Archer ; Aim
									Case $Assassin ; Blink
									Case $Bomber ; Flare
									Case $WMage ; Cure
									Case $BMage ; Fire
									Case $TMage ; Meteor
								EndSwitch
							Case $Ability2
								Switch $PlayerStats[$TurnQueue[0]][$time]
									Case $WMage ; Dispel
									Case $BMage ; Blizzard
									Case $TMage ; Slow
								EndSwitch
							Case $Ability3
								Switch $PlayerStats[$TurnQueue[0]][$time]
									Case $WMage, $BMage
										UseAbility(3)
										InitializeCommands()
										ContinueLoop 2
									Case $TMage
								EndSwitch
						EndSwitch
					WEnd
			EndSwitch
		EndIf
	WEnd
EndFunc

Func TimePasses($ReturnValue = False)
	For $i = 0 To $TeamMembers * 2 - 1
		If (Not $JustTesting) And ($i < 8) Then GUICtrlSetData($atbBar[$i], Int($InGameStats[$i][$time] / $MaxTime * 100))
		If $InGameStats[$i][$hp] <= 0 Then
			$InGameStats[$i][$time] = 0
		ElseIf $InGameStats[$i][$time] >= $MaxTime Then
			$InGameStats[$i][$time] = $MaxTime
			For $j = 0 To 2 * $TeamMembers - 1
				If $TurnQueue[$j] = $i Then ExitLoop
			Next
			If $j > 2 * $TeamMembers - 1 Then
				If $queuers < 0 Then $queuers = 0
				$TurnQueue[$queuers] = $i
				$queuers += 1
			EndIf
			If Not $InTurn Then
				If $ReturnValue Then Return True
				$InTurn = True
				If $InGameStats[$TurnQueue[0]][$hp] <= 0 Then
					CompleteTurn()
				ElseIf ($TurnQueue[0] < $TeamMembers) And ($PlayMode = 0) And (Not $JustTesting) Then
					InitializeCommands()
				Else
					AIPlaysTheGame()
				EndIf
			EndIf
		Else
			$InGameStats[$i][$time] += $InGameStats[$i][$spd]
		EndIf
	Next
EndFunc

Func SkipToNext()
	While 1
		If Annihilated(0) Or Annihilated(1) Then
			Return False
		ElseIf TimePasses(True) Then
			Return True
		EndIf
	WEnd
EndFunc

Func Distance($x1, $y1, $x2, $y2) ; Manhattan distance formula
	Return Abs($x2 - $x1) + Abs($y2 - $y1)
EndFunc

Func Min($a, $b)
	Return ($a < $b) ? $a : $b
EndFunc

Func Max($a, $b)
	Return ($a > $b) ? $a : $b
EndFunc

Func IsLeaf(ByRef Const $tree, $NodeIndex)
	For $i = 0 To UBound($tree) - 1
		If $tree[$i][$tParent] = $NodeIndex Then Return False
	Next
	Return True
EndFunc

Func NodeDepth(ByRef Const $tree, $NodeIndex)
	Local $node = $NodeIndex, $result = 0
	While $node > 0
		$node = $tree[$node][$tParent]
		$result += 1
	WEnd
	Return $result
EndFunc

Func OpposingTeams($player1, $player2)
	Return (($player1 < $TeamMembers) And ($player2 >= $TeamMembers)) Or _
			(($player1 >= $TeamMembers) And ($player2 < $TeamMembers))
EndFunc

Func HierarchicalTesting(ByRef $aiTree, $NodeIndex, $depth, $OriginalMode, $CurrentPlayer, $alpha = -1E18, $beta = +1E18)
	Local $offset = ($CurrentPlayer < $TeamMembers) ? 0 : $TeamMembers
	Local $score = 0, $survivors, $found = False, $nodes, $matched, $total = 0, $MaxIndex
	Local $lOriginalQueue, $lOriginalStats, $lOriginalQueuers, $lOriginalTarget, $lOriginalSearch, $lOriginalInactiveTurns
	Local Const $simul = 5
	$moved = False
	$attacked = False
	BackupStates($lOriginalTarget, $lOriginalSearch, $lOriginalInactiveTurns, $lOriginalQueuers, $lOriginalQueue, $lOriginalStats)
	Switch $aiTree[$NodeIndex][$tAction] ; First do the designated action!
		Case 1
			MoveCharacter($aiTree[$NodeIndex][$tX], $aiTree[$NodeIndex][$tY])
			AIPlaysTheGame()
		Case 2
			AttackCharacter($aiTree[$NodeIndex][$tX], $aiTree[$NodeIndex][$tY])
			AIPlaysTheGame()
		Case Else
			CompleteTurn()
	EndSwitch
	If $OriginalMode = $aiImprovedMC Then
		$TestingTurns = 0
		While $TestingTurns < 5
			If Annihilated(0) Or Annihilated(1) Then ExitLoop
			TimePasses()
		WEnd
	EndIf
	If ($depth <= 0) Or Not SkipToNext() Then
		$survivors = 0
		For $j = 0 + $offset To $TeamMembers - 1 + $offset
			If $InGameStats[$j][$hp] > 0 Then $survivors += 1
		Next
		For $j = 0 + $offset To $TeamMembers - 1 + $offset
			$score += $InGameStats[$j][$hp] * $survivors
		Next
		$survivors = 0
		For $j = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
			If $InGameStats[$j][$hp] > 0 Then $survivors += 1
		Next
		For $j = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
			$score -= $InGameStats[$j][$hp] * $survivors
		Next
		If Annihilated(0) Or Annihilated(1) Then $score *= 2
		If OpposingTeams($CurrentPlayer, $TurnQueue[0]) Then $score *= -1
		RestoreStates($lOriginalTarget, $lOriginalSearch, $lOriginalInactiveTurns, _
				$lOriginalQueuers, $lOriginalQueue, $lOriginalStats)
		Return $score
	EndIf
	$offset = ($TurnQueue[0] < $TeamMembers) ? 0 : $TeamMembers
	$score = -1E18
	$total = 0
	BackupStates($lOriginalTarget, $lOriginalSearch, $lOriginalInactiveTurns, $lOriginalQueuers, $lOriginalQueue, $lOriginalStats)
	For $i = Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$mov]) To _
			Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$x] + $InGameStats[$TurnQueue[0]][$rng])
		For $j = Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$mov]) To _
				Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$y] + $InGameStats[$TurnQueue[0]][$rng])
			If (Distance($i, $j, $InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y]) <= _
					$InGameStats[$TurnQueue[0]][$rng]) Then
				For $k = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
					If ($InGameStats[$k][$hp] > 0) And _
							(Distance($i, $j, $InGameStats[$k][$x], $InGameStats[$k][$y]) <= _
							$InGameStats[$TurnQueue[0]][$area]) Then
						ReDim $aiTree[UBound($aiTree, 1) + 1][5]
						$nodes = UBound($aiTree, 1) - 1
						$aiTree[$nodes][$tAction] = 2
						$aiTree[$nodes][$tX] = $i
						$aiTree[$nodes][$tY] = $j
						; v := −negamax(child, depth − 1, −β, −α, −color)
						$aiTree[$nodes][$tParent] = $NodeIndex
						If $OriginalMode = $aiMinimax Then
							$aiTree[$nodes][$tScore] = OpposingTeams($CurrentPlayer, $TurnQueue[0]) ? _
									HierarchicalTesting($aiTree, $nodes, $depth - 1, $OriginalMode, $CurrentPlayer, -$beta, -$alpha) : _
									HierarchicalTesting($aiTree, $nodes, $depth - 1, $OriginalMode, $CurrentPlayer, $alpha, $beta)
						Else
							$aiTree[$nodes][$tScore] = 0
							For $l = 1 To $simul
								$aiTree[$nodes][$tScore] += HierarchicalTesting($aiTree, $nodes, 0, $OriginalMode, $CurrentPlayer)
							Next
							$total += $simul
						EndIf
						If $aiTree[$nodes][$tScore] > $score Then $score = $aiTree[$nodes][$tScore]
						If $aiTree[$nodes][$tScore] > $alpha Then $alpha = $aiTree[$nodes][$tScore]
						If $alpha >= $beta Then ExitLoop 3
						RestoreStates($lOriginalTarget, $lOriginalSearch, $lOriginalInactiveTurns, _
								$lOriginalQueuers, $lOriginalQueue, $lOriginalStats)
						ExitLoop
					EndIf
				Next
			EndIf
		Next
	Next
	For $i = Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$mov]) To _
			Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$x] + $InGameStats[$TurnQueue[0]][$mov])
		For $j = Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$mov]) To _
				Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$y] + $InGameStats[$TurnQueue[0]][$mov])
			$matched = True
			For $k = 0 To 2 * $TeamMembers - 1
				If ($InGameStats[$k][$x] = $i) And ($InGameStats[$k][$y] = $j) Then $matched = False
			Next
			If $matched And (Distance($InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y], _
					$i, $j) <= $InGameStats[$TurnQueue[0]][$mov]) Then
				For $k = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
					If ($InGameStats[$k][$hp] > 0) And (Distance($i, $j, _
							$InGameStats[$k][$x], $InGameStats[$k][$y]) <= _
							$InGameStats[$TurnQueue[0]][$rng]) Then
						$found = True
						ReDim $aiTree[UBound($aiTree, 1) + 1][5]
						$nodes = UBound($aiTree, 1) - 1
						$aiTree[$nodes][$tAction] = 1
						$aiTree[$nodes][$tX] = $i
						$aiTree[$nodes][$tY] = $j
						$aiTree[$nodes][$tParent] = $NodeIndex
						If $OriginalMode = $aiMinimax Then
							$aiTree[$nodes][$tScore] = OpposingTeams($CurrentPlayer, $TurnQueue[0]) ? _
									HierarchicalTesting($aiTree, $nodes, $depth - 1, $OriginalMode, $CurrentPlayer, -$beta, -$alpha) : _
									HierarchicalTesting($aiTree, $nodes, $depth - 1, $OriginalMode, $CurrentPlayer, $alpha, $beta)
						Else
							$aiTree[$nodes][$tScore] = 0
							For $l = 1 To $simul
								$aiTree[$nodes][$tScore] += HierarchicalTesting($aiTree, $nodes, 0, $OriginalMode, $CurrentPlayer)
							Next
							$total += $simul
						EndIf
						If $aiTree[$nodes][$tScore] > $score Then $score = $aiTree[$nodes][$tScore]
						If $aiTree[$nodes][$tScore] > $alpha Then $alpha = $aiTree[$nodes][$tScore]
						If $alpha >= $beta Then ExitLoop 3
						RestoreStates($lOriginalTarget, $lOriginalSearch, $lOriginalInactiveTurns, _
								$lOriginalQueuers, $lOriginalQueue, $lOriginalStats)
						ExitLoop
					EndIf
				Next
			EndIf
		Next
	Next
	If Not $found Then
		For $i = 1 To 6 ; Try 6 random legal destinations
			$destX = Random(Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$mov]), _
					Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$x] + $InGameStats[$TurnQueue[0]][$mov]), 1)
			$destY = Random(Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$mov]), _
					Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$y] + $InGameStats[$TurnQueue[0]][$mov]), 1)
			$matched = True
			For $k = 0 To 2 * $TeamMembers - 1
				If ($InGameStats[$k][$x] = $destX) And ($InGameStats[$k][$y] = $destY) Then $matched = False
			Next
			If $matched And (Distance($InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y], _
					$destX, $destY) <= $InGameStats[$TurnQueue[0]][$mov]) Then
				ReDim $aiTree[UBound($aiTree, 1) + 1][5]
				$nodes = UBound($aiTree, 1) - 1
				$aiTree[$nodes][$tAction] = 1
				$aiTree[$nodes][$tX] = $destX
				$aiTree[$nodes][$tY] = $destY
				$aiTree[$nodes][$tParent] = $NodeIndex
				If $OriginalMode = $aiMinimax Then
					$aiTree[$nodes][$tScore] = OpposingTeams($CurrentPlayer, $TurnQueue[0]) ? _
							HierarchicalTesting($aiTree, $nodes, $depth - 1, $OriginalMode, $CurrentPlayer, -$beta, -$alpha) : _
							HierarchicalTesting($aiTree, $nodes, $depth - 1, $OriginalMode, $CurrentPlayer, $alpha, $beta)
				Else
					$aiTree[$nodes][$tScore] = 0
					For $l = 1 To $simul
						$aiTree[$nodes][$tScore] += HierarchicalTesting($aiTree, $nodes, 0, $OriginalMode, $CurrentPlayer)
					Next
					$total += $simul
				EndIf
				If $aiTree[$nodes][$tScore] > $score Then $score = $aiTree[$nodes][$tScore]
				If $aiTree[$nodes][$tScore] > $alpha Then $alpha = $aiTree[$nodes][$tScore]
				If $alpha >= $beta Then ExitLoop
				RestoreStates($lOriginalTarget, $lOriginalSearch, $lOriginalInactiveTurns, _
						$lOriginalQueuers, $lOriginalQueue, $lOriginalStats)
			EndIf
		Next
	EndIf
	ReDim $aiTree[UBound($aiTree, 1) + 1][5]
	$nodes = UBound($aiTree, 1) - 1
	$aiTree[$nodes][$tAction] = 0
	$aiTree[$nodes][$tX] = 0
	$aiTree[$nodes][$tY] = 0
	$aiTree[$nodes][$tParent] = $NodeIndex
	If $OriginalMode = $aiMinimax Then
		$aiTree[$nodes][$tScore] = OpposingTeams($CurrentPlayer, $TurnQueue[0]) ? _
				HierarchicalTesting($aiTree, $nodes, $depth - 1, $OriginalMode, $CurrentPlayer, -$beta, -$alpha) : _
				HierarchicalTesting($aiTree, $nodes, $depth - 1, $OriginalMode, $CurrentPlayer, $alpha, $beta)
	Else
		$aiTree[$nodes][$tScore] = 0
		For $l = 1 To $simul
			$aiTree[$nodes][$tScore] += HierarchicalTesting($aiTree, $nodes, 0, $OriginalMode, $CurrentPlayer)
		Next
		$total += $simul
	EndIf
	If $aiTree[$nodes][$tScore] > $score Then $score = $aiTree[$nodes][$tScore]
	If $OriginalMode = $aiImprovedMC Then
		; ReDim $aiTree[UBound($aiTree, 1)][8]
		For $i = 0 To UBound($aiTree, 1) - 1
			If $aiTree[$i][$tParent] = $NodeIndex Then
				$MaxIndex = $i
				ExitLoop
			EndIf
		Next
		For $i = 0 To UBound($aiTree, 1) - 1
			If $aiTree[$i][$tParent] = $NodeIndex Then
				; $aiTree[$i][5] = $aiTree[$i][$tScore] / $simul
				; $aiTree[$i][6] = Sqrt(1000 * Log($total) / $simul)
				$aiTree[$i][$tScore] = ($aiTree[$i][$tScore] / $simul) + Sqrt(1000 * Log($total) / $simul)
				If $aiTree[$i][$tScore] > $aiTree[$MaxIndex][$tScore] Then $MaxIndex = $i
			EndIf
		Next
		$gTotal += $total
		$score = (HierarchicalTesting($aiTree, $MaxIndex, $depth - 1, $OriginalMode, $CurrentPlayer) / $simul) _
				+ Sqrt(1000 * Log($gTotal) / $simul)
		; $aiTree[$NodeIndex][7] = $gTotal
	EndIf
	RestoreStates($lOriginalTarget, $lOriginalSearch, $lOriginalInactiveTurns, $lOriginalQueuers, $lOriginalQueue, $lOriginalStats)
	Return $score
EndFunc

Func MonteCarloMinimaxTesting(ByRef $aiTree)
	Local $MaxIndex, $MaxIndexes[1], $MaxScore, $start, $EndingFactor, $survivors
	Local $MinScore, $StatesBeforeTesting, $matched, $score
	Local $nodes = UBound($aiTree, 1) - 1, $CurrentPlayer = $TurnQueue[0]
	Local $offset = ($TurnQueue[0] < $TeamMembers) ? 0 : $TeamMembers
	$JustTesting = True
	Switch $aiMode
		Case $aiMonteCarlo
			$aiMode = $aiRandom
			If $nodes > 1 Then
				For $i = 1 To $nodes
					For $k = 1 To 50
						$score = 0
						Switch $aiTree[$i][$tAction]
							Case 1
								MoveCharacter($aiTree[$i][$tX], $aiTree[$i][$tY])
								AIPlaysTheGame()
							Case 2
								AttackCharacter($aiTree[$i][$tX], $aiTree[$i][$tY])
								AIPlaysTheGame()
							Case Else
								CompleteTurn()
						EndSwitch
						$TestingTurns = 0
						$EndingFactor = 1
						While $TestingTurns < 8
							If Annihilated(0) Or Annihilated(1) Then
								$EndingFactor = 2
								ExitLoop
							EndIf
							TimePasses()
						WEnd
						$survivors = 0
						For $j = 0 + $offset To $TeamMembers - 1 + $offset
							If $InGameStats[$j][$hp] > 0 Then $survivors += 1
						Next
						For $j = 0 + $offset To $TeamMembers - 1 + $offset
							$score += $InGameStats[$j][$hp] * $survivors
						Next
						$survivors = 0
						For $j = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
							If $InGameStats[$j][$hp] > 0 Then $survivors += 1
						Next
						For $j = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
							$score -= $InGameStats[$j][$hp] * $survivors
						Next
						$aiTree[$i][$tScore] += $score * $EndingFactor
						RestoreStates($OriginalTarget, $OriginalSearch, $OriginalInactiveTurns, _
								$OriginalQueuers, $OriginalQueue, $OriginalStats)
					Next
				Next
			EndIf
			$aiMode = $aiMonteCarlo
		Case $aiMinimax
			$aiMode = $aiOffensive
			If $nodes > 1 Then
				For $i = 1 To $nodes
					$aiTree[$i][$tScore] = HierarchicalTesting($aiTree, $i, 3, $aiMinimax, $TurnQueue[0])
					RestoreStates($OriginalTarget, $OriginalSearch, $OriginalInactiveTurns, _
							$OriginalQueuers, $OriginalQueue, $OriginalStats)
				Next
			EndIf
			$aiMode = $aiMinimax
			; _ArrayDisplay($aiTree)
		Case $aiImprovedMC
			$aiMode = $aiOffensive
			If $nodes > 1 Then
				For $i = 1 To $nodes
					$gTotal = 0
					$aiTree[$i][$tScore] = HierarchicalTesting($aiTree, $i, 4, $aiImprovedMC, $TurnQueue[0])
					RestoreStates($OriginalTarget, $OriginalSearch, $OriginalInactiveTurns, _
							$OriginalQueuers, $OriginalQueue, $OriginalStats)
				Next
			EndIf
			$aiMode = $aiImprovedMC
			; _ArrayDisplay($aiTree)
	EndSwitch
	$MaxScore = ($nodes > 0) ? $aiTree[1][$tScore] : $aiTree[0][$tScore]
	For $i = 1 To $nodes
		If ($aiTree[$i][$tScore] > $MaxScore) Then $MaxScore = $aiTree[$i][$tScore]
	Next
	For $i = 1 To $nodes
		If ($aiTree[$i][$tScore] = $MaxScore) Then
			$MaxIndexes[UBound($MaxIndexes) - 1] = $i
			ReDim $MaxIndexes[UBound($MaxIndexes) + 1]
		EndIf
	Next
	$MaxIndex = $MaxIndexes[Random(0, UBound($MaxIndexes) - 2, 1)]
	RestoreStates($OriginalTarget, $OriginalSearch, $OriginalInactiveTurns, $OriginalQueuers, $OriginalQueue, $OriginalStats)
	$JustTesting = False
	Switch $aiTree[$MaxIndex][$tAction]
		Case 1
			MoveCharacter($aiTree[$MaxIndex][$tX], $aiTree[$MaxIndex][$tY])
		Case 2
			AttackCharacter($aiTree[$MaxIndex][$tX], $aiTree[$MaxIndex][$tY])
	EndSwitch
	Return $aiTree[$MaxIndex][$tAction]
EndFunc

Func MonteCarloMinimaxAI()
	; AI tree elements: [action, destX, destY, score, parent]
	; Actions: 0 (do nothing), 1 (move), 2 (attack)
	Local $offset = ($TurnQueue[0] < $TeamMembers) ? 0 : $TeamMembers
	Local $destX, $destY, $nodes, $matched, $found = False
	Local $ReallyMoved = $moved, $ReallyAttacked = $attacked, $aiTree[1][5] = [[0, 0, 0, 0, -1]]
	; If $aiMode >= $aiMonteCarlo Then _
	_GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$TurnQueue[0]] & " is thinking..." & @CRLF)
	BackupStates($OriginalTarget, $OriginalSearch, $OriginalInactiveTurns, $OriginalQueuers, $OriginalQueue, $OriginalStats)
	For $i = Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$mov]) To _
			Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$x] + $InGameStats[$TurnQueue[0]][$rng])
		For $j = Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$mov]) To _
				Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$y] + $InGameStats[$TurnQueue[0]][$rng])
			If (Distance($i, $j, $InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y]) <= _
					$InGameStats[$TurnQueue[0]][$rng]) Then
				For $k = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
					If ($InGameStats[$k][$hp] > 0) And _
							(Distance($i, $j, $InGameStats[$k][$x], $InGameStats[$k][$y]) <= _
							$InGameStats[$TurnQueue[0]][$area]) Then
						ReDim $aiTree[UBound($aiTree, 1) + 1][5]
						$nodes = UBound($aiTree, 1) - 1
						$aiTree[$nodes][$tAction] = 2
						$aiTree[$nodes][$tX] = $i
						$aiTree[$nodes][$tY] = $j
						$aiTree[$nodes][$tScore] = 0
						$aiTree[$nodes][$tParent] = 0
						ExitLoop
					EndIf
				Next
			EndIf
		Next
	Next
	If MonteCarloMinimaxTesting($aiTree) = 2 Then $ReallyAttacked = True
	BackupStates($OriginalTarget, $OriginalSearch, $OriginalInactiveTurns, $OriginalQueuers, $OriginalQueue, $OriginalStats)
	ReDim $aiTree[1][5]
	$aiTree[0][$tScore] = 0
	For $i = Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$mov]) To _
			Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$x] + $InGameStats[$TurnQueue[0]][$mov])
		For $j = Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$mov]) To _
				Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$y] + $InGameStats[$TurnQueue[0]][$mov])
			$matched = True
			For $k = 0 To 2 * $TeamMembers - 1
				If ($InGameStats[$k][$x] = $i) And ($InGameStats[$k][$y] = $j) Then $matched = False
			Next
			If $matched And (Distance($InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y], _
					$i, $j) <= $InGameStats[$TurnQueue[0]][$mov]) Then
				For $k = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
					If ($InGameStats[$k][$hp] > 0) And (Distance($i, $j, _
							$InGameStats[$k][$x], $InGameStats[$k][$y]) <= _
							$InGameStats[$TurnQueue[0]][$rng]) Then
						$found = True
						ReDim $aiTree[UBound($aiTree, 1) + 1][5]
						$nodes = UBound($aiTree, 1) - 1
						$aiTree[$nodes][$tAction] = 1
						$aiTree[$nodes][$tX] = $i
						$aiTree[$nodes][$tY] = $j
						$aiTree[$nodes][$tScore] = 0
						$aiTree[$nodes][$tParent] = 0
						ExitLoop
					EndIf
				Next
			EndIf
		Next
	Next
	If Not $found Then
		For $i = 1 To 6 ; Try 6 random legal destinations
			$destX = Random(Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$mov]), _
					Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$x] + $InGameStats[$TurnQueue[0]][$mov]), 1)
			$destY = Random(Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$mov]), _
					Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$y] + $InGameStats[$TurnQueue[0]][$mov]), 1)
			$matched = True
			For $k = 0 To 2 * $TeamMembers - 1
				If ($InGameStats[$k][$x] = $destX) And ($InGameStats[$k][$y] = $destY) Then $matched = False
			Next
			If $matched And (Distance($InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y], _
					$destX, $destY) <= $InGameStats[$TurnQueue[0]][$mov]) Then
				ReDim $aiTree[UBound($aiTree, 1) + 1][5]
				$nodes = UBound($aiTree, 1) - 1
				$aiTree[$nodes][$tAction] = 1
				$aiTree[$nodes][$tX] = $destX
				$aiTree[$nodes][$tY] = $destY
				$aiTree[$nodes][$tScore] = 0
				$aiTree[$nodes][$tParent] = 0
			EndIf
		Next
	EndIf
	ReDim $aiTree[UBound($aiTree, 1) + 1][5]
	$nodes = UBound($aiTree, 1) - 1
	$aiTree[$nodes][$tAction] = 0
	$aiTree[$nodes][$tX] = 0
	$aiTree[$nodes][$tY] = 0
	$aiTree[$nodes][$tScore] = 0
	$aiTree[$nodes][$tParent] = 0
	If MonteCarloMinimaxTesting($aiTree) = 1 Then $ReallyMoved = True
	If Not $ReallyAttacked Then
		BackupStates($OriginalTarget, $OriginalSearch, $OriginalInactiveTurns, $OriginalQueuers, $OriginalQueue, $OriginalStats)
		ReDim $aiTree[1][5]
		$aiTree[0][$tScore] = 0
		For $i = Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$mov]) To _
				Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$x] + $InGameStats[$TurnQueue[0]][$rng])
			For $j = Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$mov]) To _
					Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$y] + $InGameStats[$TurnQueue[0]][$rng])
				If (Distance($i, $j, $InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y]) <= _
						$InGameStats[$TurnQueue[0]][$rng]) Then
					For $k = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
						If ($InGameStats[$k][$hp] > 0) And _
								(Distance($i, $j, $InGameStats[$k][$x], $InGameStats[$k][$y]) <= _
								$InGameStats[$TurnQueue[0]][$area]) Then
							ReDim $aiTree[UBound($aiTree, 1) + 1][5]
							$nodes = UBound($aiTree, 1) - 1
							$aiTree[$nodes][$tAction] = 2
							$aiTree[$nodes][$tX] = $i
							$aiTree[$nodes][$tY] = $j
							$aiTree[$nodes][$tScore] = 0
							$aiTree[$nodes][$tParent] = 0
							ExitLoop
						EndIf
					Next
				EndIf
			Next
		Next
		If MonteCarloMinimaxTesting($aiTree) = 2 Then $ReallyAttacked = True
	EndIf
	$attacked = $ReallyAttacked
	$moved = $ReallyMoved
EndFunc

Func ChangeAIMode($player1, $player2)
	$aiMode = ($TurnQueue[0] < $TeamMembers) ? $player1 : $player2
EndFunc

Func AIPlaysTheGame($change = True)
	Local $offset = ($TurnQueue[0] < $TeamMembers) ? 0 : $TeamMembers, $matched = False, $destX, $destY
	Local Const $weight = 30 ; For targeting, every distance unit is exchanged to 30 HP
	If $change And Not $JustTesting Then ChangeAIMode($AllyAIMode, $EnemyAIMode)
	Switch $aiMode
		Case $aiRandom
			If (Not $attacked) And Random(0, 4, 1) Then ; 75% chance of trying to attack first
				For $i = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
					If ($InGameStats[$i][$hp] > 0) And _
							(Distance($InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y], _
							$InGameStats[$i][$x], $InGameStats[$i][$y]) <= _
							$InGameStats[$TurnQueue[0]][$rng]) Then
						AttackCharacter($InGameStats[$i][$x], $InGameStats[$i][$y])
						ExitLoop
					EndIf
				Next
			EndIf
			If Not $moved Then
				For $i = 1 To 10 ; Try 10 random legal destinations
					$destX = Random(Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$mov]), _
							Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$x] + $InGameStats[$TurnQueue[0]][$mov]), 1)
					$destY = Random(Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$mov]), _
							Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$y] + $InGameStats[$TurnQueue[0]][$mov]), 1)
					$matched = True
					For $k = 0 To 2 * $TeamMembers - 1
						If ($InGameStats[$k][$x] = $destX) And ($InGameStats[$k][$y] = $destY) Then
							$matched = False
							ExitLoop
						EndIf
					Next
					If $matched And (Distance($InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y], _
							$destX, $destY) <= $InGameStats[$TurnQueue[0]][$mov]) Then
						MoveCharacter($destX, $destY)
						ExitLoop
					EndIf
				Next
			EndIf
			If Not $attacked Then
				For $i = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
					If ($InGameStats[$i][$hp] > 0) And _
							(Distance($InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y], _
							$InGameStats[$i][$x], $InGameStats[$i][$y]) <= _
							$InGameStats[$TurnQueue[0]][$rng]) Then
						AttackCharacter($InGameStats[$i][$x], $InGameStats[$i][$y])
						ExitLoop
					EndIf
				Next
			EndIf
		Case $aiOffensive
			If Not $attacked Then
				For $i = 0 To $TeamMembers - 1
					If ($InGameStats[$i + $TeamMembers - $offset][$hp] <= 0) Or _
							(Distance($InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y], _
							$InGameStats[$i + $TeamMembers - $offset][$x], $InGameStats[$i + $TeamMembers - $offset][$y]) > _
							$InGameStats[$TurnQueue[0]][$rng]) Then
						$aiSearch[$i] = 1E9
					Else
						$aiSearch[$i] = Distance($InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y], _
								$InGameStats[$i + $TeamMembers - $offset][$x], $InGameStats[$i + $TeamMembers - $offset][$y]) * $weight _
								+ $InGameStats[$i + $TeamMembers - $offset][$hp]
					EndIf
				Next
				$matched = False
				For $i = 0 To $TeamMembers - 1
					If $aiSearch[$i] <> 1E9 Then $matched = True
				Next
			EndIf
			If $matched And Not $attacked Then
				$aiTarget = _ArrayMinIndex($aiSearch, 1) + $TeamMembers - $offset
				AttackCharacter($InGameStats[$aiTarget][$x], $InGameStats[$aiTarget][$y])
			ElseIf $aiTarget = -1 Or $InGameStats[$aiTarget][$hp] <= 0 Or Random() < .1 Then ; 10% chance of changing target
				For $i = 0 To $TeamMembers - 1
					If $InGameStats[$i + $TeamMembers - $offset][$hp] <= 0 Then
						$aiSearch[$i] = 1E9
					Else
						$aiSearch[$i] = Distance($InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y], _
								$InGameStats[$i + $TeamMembers - $offset][$x], $InGameStats[$i + $TeamMembers - $offset][$y]) * $weight _
								+ $InGameStats[$i + $TeamMembers - $offset][$hp]
					EndIf
				Next
				$aiTarget = _ArrayMinIndex($aiSearch, 1) + $TeamMembers - $offset
			EndIf
			If Not $moved Then
				For $i = Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$mov]) To _
						Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$x] + $InGameStats[$TurnQueue[0]][$mov])
					For $j = Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$mov]) To _
							Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$y] + $InGameStats[$TurnQueue[0]][$mov])
						$matched = True
						For $k = 0 To 2 * $TeamMembers - 1
							If ($InGameStats[$k][$x] = $i) And ($InGameStats[$k][$y] = $j) Then
								$matched = False
								ExitLoop
							EndIf
						Next
						If $matched And (Distance($i, $j, _
								$InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y]) <= $InGameStats[$TurnQueue[0]][$mov]) Then
							$region[$i][$j] = Distance($i, $j, _
									$InGameStats[$aiTarget][$x], $InGameStats[$aiTarget][$y])
						Else
							$region[$i][$j] = 1E9
						EndIf
					Next
				Next
				$destX = Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$mov])
				$destY = Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$mov])
				For $i = Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$mov]) To _
						Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$x] + $InGameStats[$TurnQueue[0]][$mov])
					For $j = Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$mov]) To _
							Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$y] + $InGameStats[$TurnQueue[0]][$mov])
						If $region[$i][$j] < $region[$destX][$destY] Then
							$destX = $i
							$destY = $j
						EndIf
					Next
				Next
				If $region[$destX][$destY] <> 1E9 Then
					ResetRegions()
					MoveCharacter($destX, $destY)
				EndIf
			EndIf
			If Not $attacked Then
				For $i = 0 To $TeamMembers - 1
					If ($InGameStats[$i + $TeamMembers - $offset][$hp] <= 0) Or _
							(Distance($InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y], _
							$InGameStats[$i + $TeamMembers - $offset][$x], $InGameStats[$i + $TeamMembers - $offset][$y]) > _
							$InGameStats[$TurnQueue[0]][$rng]) Then
						$aiSearch[$i] = 1E9
					Else
						$aiSearch[$i] = Distance($InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y], _
								$InGameStats[$i + $TeamMembers - $offset][$x], $InGameStats[$i + $TeamMembers - $offset][$y]) * $weight _
								+ $InGameStats[$i + $TeamMembers - $offset][$hp]
					EndIf
				Next
				$matched = False
				For $i = 0 To $TeamMembers - 1
					If $aiSearch[$i] <> 1E9 Then $matched = True
				Next
				If $matched Then
					$aiTarget = _ArrayMinIndex($aiSearch, 1) + $TeamMembers - $offset
					AttackCharacter($InGameStats[$aiTarget][$x], $InGameStats[$aiTarget][$y])
				EndIf
			EndIf
		Case $aiNinja
			Local $maxX = Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$rng]), _
					$maxY = Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$rng]), _
					$moves[1][2]
			If Not $attacked Then
				ResetRegions()
				For $i = Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$rng]) To _
						Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$x] + $InGameStats[$TurnQueue[0]][$rng])
					For $j = Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$rng]) To _
							Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$y] + $InGameStats[$TurnQueue[0]][$rng])
						For $k = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
							If Distance($InGameStats[$k][$x], $InGameStats[$k][$y], $i, $j) <= _
									$InGameStats[$TurnQueue[0]][$area] Then $region[$i][$j] += 1
						Next
						If $region[$i][$j] > $region[$maxX][$maxY] Then
							$maxX = $i
							$maxY = $j
						EndIf
					Next
				Next
			EndIf
			ResetRegions()
			If (Not $attacked) And ($region[$maxX][$maxY] > 0) And (Distance($maxX, $maxY, _
					$InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y]) <= $InGameStats[$TurnQueue[0]][$rng]) Then _
					AttackCharacter($maxX, $maxY)
			If $aiTarget = -1 Or $InGameStats[$aiTarget][$hp] <= 0 Or Random() < .1 Then ; 10% chance of changing target
				For $i = 0 To $TeamMembers - 1
					If $InGameStats[$i + $TeamMembers - $offset][$hp] <= 0 Then
						$aiSearch[$i] = 1E9
					Else
						$aiSearch[$i] = Distance($InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y], _
								$InGameStats[$i + $TeamMembers - $offset][$x], $InGameStats[$i + $TeamMembers - $offset][$y]) * $weight _
								+ $InGameStats[$i + $TeamMembers - $offset][$hp]
					EndIf
				Next
				$aiTarget = _ArrayMinIndex($aiSearch, 1) + $TeamMembers - $offset
			EndIf
			If Not $moved Then
				If $attacked Then
					$maxX = Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$mov])
					$maxY = Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$mov])
					For $i = Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$mov]) To _
							Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$x] + $InGameStats[$TurnQueue[0]][$mov])
						For $j = Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$mov]) To _
								Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$y] + $InGameStats[$TurnQueue[0]][$mov])
							$matched = True
							For $k = 0 To 2 * $TeamMembers - 1
								If ($InGameStats[$k][$x] = $i) And ($InGameStats[$k][$y] = $j) Then
									$matched = False
									ExitLoop
								EndIf
							Next
							If $matched Then
								For $k = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
									If Distance($InGameStats[$k][$x], $InGameStats[$k][$y], $i, $j) <= 2 _
											Then $region[$i][$j] -= 1
								Next
								If $region[$i][$j] > $region[$maxX][$maxY] Then
									$maxX = $i
									$maxY = $j
								EndIf
							Else
								$region[$i][$j] = -1E9
							EndIf
						Next
					Next
					For $i = Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$mov]) To _
							Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$x] + $InGameStats[$TurnQueue[0]][$mov])
						For $j = Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$mov]) To _
								Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$y] + $InGameStats[$TurnQueue[0]][$mov])
							If $region[$i][$j] = $region[$maxX][$maxY] Then
								$moves[UBound($moves, 1) - 1][0] = $i
								$moves[UBound($moves, 1) - 1][1] = $j
								ReDim $moves[UBound($moves, 1) + 1][2]
							EndIf
						Next
					Next
					$maxX = Random(0, UBound($moves, 1) - 2, 1)
					ResetRegions()
					MoveCharacter($moves[$maxX][0], $moves[$maxX][1])
				Else
					For $i = Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$mov]) To _
							Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$x] + $InGameStats[$TurnQueue[0]][$mov])
						For $j = Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$mov]) To _
								Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$y] + $InGameStats[$TurnQueue[0]][$mov])
							$matched = True
							For $k = 0 To 2 * $TeamMembers - 1
								If ($InGameStats[$k][$x] = $i) And ($InGameStats[$k][$y] = $j) Then
									$matched = False
									ExitLoop
								EndIf
							Next
							If $matched And (Distance($i, $j, _
									$InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y]) <= _
									$InGameStats[$TurnQueue[0]][$mov]) Then
								$region[$i][$j] = Distance($i, $j, _
										$InGameStats[$aiTarget][$x], $InGameStats[$aiTarget][$y])
							Else
								$region[$i][$j] = 1E9
							EndIf
						Next
					Next
					$destX = Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$mov])
					$destY = Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$mov])
					For $i = Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$mov]) To _
							Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$x] + $InGameStats[$TurnQueue[0]][$mov])
						For $j = Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$mov]) To _
								Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$y] + $InGameStats[$TurnQueue[0]][$mov])
							If $region[$i][$j] < $region[$destX][$destY] Then
								$destX = $i
								$destY = $j
							EndIf
						Next
					Next
					If $region[$destX][$destY] <> 1E9 Then
						ResetRegions()
						MoveCharacter($destX, $destY)
					EndIf
				EndIf
			EndIf
			If Not $attacked Then
				ResetRegions()
				Local $maxX = Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$rng]), _
						$maxY = Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$rng])
				For $i = Max(0, $InGameStats[$TurnQueue[0]][$x] - $InGameStats[$TurnQueue[0]][$rng]) To _
						Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$x] + $InGameStats[$TurnQueue[0]][$rng])
					For $j = Max(0, $InGameStats[$TurnQueue[0]][$y] - $InGameStats[$TurnQueue[0]][$rng]) To _
							Min($MapSize - 1, $InGameStats[$TurnQueue[0]][$y] + $InGameStats[$TurnQueue[0]][$rng])
						For $k = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
							If Distance($InGameStats[$k][$x], $InGameStats[$k][$y], $i, $j) <= _
									$InGameStats[$TurnQueue[0]][$area] Then $region[$i][$j] += 1
						Next
						If $region[$i][$j] > $region[$maxX][$maxY] Then
							$maxX = $i
							$maxY = $j
						EndIf
					Next
				Next
				ResetRegions()
				If Distance($maxX, $maxY, _
						$InGameStats[$TurnQueue[0]][$x], $InGameStats[$TurnQueue[0]][$y]) <= $InGameStats[$TurnQueue[0]][$rng] Then _
						AttackCharacter($maxX, $maxY)
			EndIf
		Case $aiMonteCarlo, $aiMinimax, $aiImprovedMC
			MonteCarloMinimaxAI()
	EndSwitch
	CompleteTurn()
EndFunc

Func BackupStates(ByRef $OriginalTarget, ByRef $OriginalSearch, ByRef $OriginalInactiveTurns, _
		ByRef $OriginalQueuers, ByRef $OriginalQueue, ByRef $OriginalStats)
	$OriginalTarget = $aiTarget
	$OriginalSearch = $aiSearch
	$OriginalInactiveTurns = $InactiveTurns
	$OriginalQueuers = $queuers
	$OriginalQueue = $TurnQueue
	$OriginalStats = $InGameStats
EndFunc

Func RestoreStates(ByRef $OriginalTarget, ByRef $OriginalSearch, ByRef $OriginalInactiveTurns, _
		ByRef $OriginalQueuers, ByRef $OriginalQueue, ByRef $OriginalStats)
	$aiTarget = $OriginalTarget
	$aiSearch = $OriginalSearch
	$InactiveTurns = $OriginalInactiveTurns
	$queuers = $OriginalQueuers
	$TurnQueue = $OriginalQueue
	$InGameStats = $OriginalStats
EndFunc

Func UseAbility($ability = 1, $destX = Default, $destY = Default)
	Local $offset = ($TurnQueue[0] < $TeamMembers) ? 0 : $TeamMembers
	$attacked = True
	Switch $PlayerStats[$TurnQueue[0]][$time]
		Case $Fighter, $BlBelt, $Archer, $Bomber
			Switch $PlayerStats[$TurnQueue[0]][$time]
				Case $Fighter ; Temper
					$InGameStats[$TurnQueue[0]][$atk] *= 1.5
					_GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$TurnQueue[0]] & " cast Temper. ")
				Case $BlBelt ; Focus
					$InGameStats[$TurnQueue[0]][$mov] = 2
					$InGameStats[$TurnQueue[0]][$atk] *= 1.5
					_GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$TurnQueue[0]] & " cast Focus, decreasing movement range to " & _
							$InGameStats[$TurnQueue[0]][$mov] & " for one turn. ")
				Case $Archer ; Aim
					$InGameStats[$TurnQueue[0]][$atk] *= 1.5
					_GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$TurnQueue[0]] & " cast Aim. ")
				Case $Bomber ; Flare
					_GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$TurnQueue[0]] & " cast Flare. ")
			EndSwitch
			$InGameStats[$TurnQueue[0]][$mp] -= 1
			For $i = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
				If Distance($destX, $destY, $InGameStats[$i][$x], $InGameStats[$i][$y]) <= $InGameStats[$TurnQueue[0]][$area] Then _
						CharacterDamage($i, 4)
			Next
			Switch $PlayerStats[$TurnQueue[0]][$time]
				Case $Fighter, $BlBelt
					$InGameStats[$TurnQueue[0]][$atk] = $PlayerStats[$TurnQueue[0]][$atk]
				Case $Archer
					$InGameStats[$TurnQueue[0]][$atk] = $PlayerStats[$TurnQueue[0]][$atk]
					$InGameStats[$TurnQueue[0]][$rng] = $PlayerStats[$TurnQueue[0]][$rng]
				Case $Bomber
					$InGameStats[$TurnQueue[0]][$area] = $PlayerStats[$TurnQueue[0]][$area]
					$InGameStats[$TurnQueue[0]][$rng] = $PlayerStats[$TurnQueue[0]][$rng]
			EndSwitch
		Case $Assassin ; Blink
			$InGameStats[$TurnQueue[0]][$mov] = 6
			_GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$TurnQueue[0]] & " cast Blink, increasing movement range to " & _
					$InGameStats[$TurnQueue[0]][$mov] & " for one turn. ")
			$InGameStats[$TurnQueue[0]][$mp] -= 1
		Case $WMage
			Switch $ability
				Case 1 ; Cure
					_GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$TurnQueue[0]] & " cast Cure. ")
					$InGameStats[$TurnQueue[0]][$mp] -= 2
					For $i = 0 + $offset To $TeamMembers - 1 + $offset
						If $InGameStats[$i][$hp] <= 0 Then ContinueLoop
						If Distance($destX, $destY, $InGameStats[$i][$x], $InGameStats[$i][$y]) = 0 Then
							$dmg = Round($InGameStats[$TurnQueue[0]][$atk] * 4) + Random(-5, 5, 1)
							$InGameStats[$i][$hp] += $dmg
							_GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$i] & " restored " & $dmg & " HP. ")
							If $InGameStats[$i][$hp] > $PlayerStats[$i][$hp] Then $InGameStats[$i][$hp] = $PlayerStats[$i][$hp]
							If $i < 8 Then GUICtrlSetData($hpDisplay[$i], $InGameStats[$i][$hp])
						EndIf
					Next
				Case 2 ; Dispel
					_GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$TurnQueue[0]] & " cast Dispel. ")
					$InGameStats[$TurnQueue[0]][$mp] -= 2
					For $i = 0 + $offset To $TeamMembers - 1 + $offset
						If $InGameStats[$i][$hp] <= 0 Then ContinueLoop
						If Distance($destX, $destY, $InGameStats[$i][$x], $InGameStats[$i][$y]) = 0 Then
							$InGameStats[$i][$def] = $PlayerStats[$i][$def]
							$InGameStats[$i][$spd] = $PlayerStats[$i][$spd]
							_GUICtrlEdit_AppendText($BattleLog, "All speed and defense debuffs on " & $PlayerNames[$i] & _
									"were dispelled. ")
						EndIf
					Next
				Case 3 ; Heal
					_GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$TurnQueue[0]] & " cast Heal. ")
					$InGameStats[$TurnQueue[0]][$mp] -= 3
					For $i = 0 + $offset To $TeamMembers - 1 + $offset
						If $InGameStats[$i][$hp] <= 0 Then ContinueLoop
						$dmg = Round($InGameStats[$TurnQueue[0]][$atk] * 2) + Random(-5, 5, 1)
						$InGameStats[$i][$hp] += $dmg
						_GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$i] & " restored " & $dmg & " HP. ")
						If $InGameStats[$i][$hp] > $PlayerStats[$i][$hp] Then $InGameStats[$i][$hp] = $PlayerStats[$i][$hp]
						If $i < 8 Then GUICtrlSetData($hpDisplay[$i], $InGameStats[$i][$hp])
					Next
			EndSwitch
		Case $BMage
			Switch $ability
				Case 1 ; Fire
					_GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$TurnQueue[0]] & " cast Fire. ")
					$InGameStats[$TurnQueue[0]][$mp] -= 2
					$InGameStats[$TurnQueue[0]][$atk] *= 3
					For $i = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
						If Distance($destX, $destY, $InGameStats[$i][$x], $InGameStats[$i][$y]) = 0 Then _
								CharacterDamage($i, 3)
					Next
				Case 2 ; Blizzard
					_GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$TurnQueue[0]] & " cast Blizzard. ")
					$InGameStats[$TurnQueue[0]][$mp] -= 3
					$InGameStats[$TurnQueue[0]][$atk] *= 2.5
					$InGameStats[$TurnQueue[0]][$area] = 2
					For $i = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
						If Distance($destX, $destY, $InGameStats[$i][$x], $InGameStats[$i][$y]) <= _
								$InGameStats[$TurnQueue[0]][$area] Then CharacterDamage($i, 4)
					Next
				Case 3 ; Thunder
					_GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$TurnQueue[0]] & " cast Thunder. ")
					$InGameStats[$TurnQueue[0]][$mp] -= 5
					$InGameStats[$TurnQueue[0]][$atk] *= 2
					For $i = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
						CharacterDamage($i, 5)
					Next
			EndSwitch
			$InGameStats[$TurnQueue[0]][$atk] = $PlayerStats[$TurnQueue[0]][$atk]
			$InGameStats[$TurnQueue[0]][$rng] = $PlayerStats[$TurnQueue[0]][$rng]
			$InGameStats[$TurnQueue[0]][$area] = $PlayerStats[$TurnQueue[0]][$area]
		Case $TMage
			Switch $ability
				Case 1 ; Meteor
					_GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$TurnQueue[0]] & " cast Meteor. ")
					$InGameStats[$TurnQueue[0]][$mp] -= 1
					$i = Random($TeamMembers - 2 - $offset, 2 * $TeamMembers - 1 - $offset)
					If $i < $offset Then
						_GUICtrlEdit_AppendText($BattleLog, "Unfortunately, the ability missed. ")
					Else
						$InGameStats[$TurnQueue[0]][$atk] *= 4
						CharacterDamage($i, 10)
						$InGameStats[$TurnQueue[0]][$atk] = $PlayerStats[$TurnQueue[0]][$atk]
					EndIf
				Case 2 ; Slow
					_GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$TurnQueue[0]] & " cast Slow. ")
					$InGameStats[$TurnQueue[0]][$mp] -= 1
					For $i = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
						If Distance($destX, $destY, $InGameStats[$i][$x], $InGameStats[$i][$y]) = 0 Then
							$InGameStats[$i][$spd] = Round($InGameStats[$i][$spd] * .75)
							_GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$i] & " was slowed by 25%. ")
						EndIf
					Next
				Case 3 ; Break
					_GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$TurnQueue[0]] & " cast Break. ")
					$InGameStats[$TurnQueue[0]][$mp] -= 1
					For $i = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
						If Distance($destX, $destY, $InGameStats[$i][$x], $InGameStats[$i][$y]) = 0 Then
							$InGameStats[$i][$def] -= 10
							_GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$i] & " lost 10 defense. ")
						EndIf
					Next
			EndSwitch
			$InGameStats[$TurnQueue[0]][$rng] = $PlayerStats[$TurnQueue[0]][$rng]
	EndSwitch
	If $TurnQueue[0] < 8 Then GUICtrlSetData($mpDisplay[$TurnQueue[0]], $InGameStats[$i][$mp])
	_GUICtrlEdit_AppendText($BattleLog, @CRLF)
	RedrawWindow()
EndFunc

Func CharacterDamage($i, $variation = 0)
	If $InGameStats[$i][$hp] <= 0 Then Return
	Local $dmg = FinalDamage(Round($InGameStats[$TurnQueue[0]][$atk]) + Random(-$variation, $variation, 1), $InGameStats[$i][$def])
	$InGameStats[$i][$hp] -= $dmg
	If $InGameStats[$i][$hp] <= 0 Then
		If Not $JustTesting Then _GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$i] & " took " & $dmg & " damage and was knocked out. ")
		$InGameStats[$i][$hp] = 0
		$InGameStats[$i][$x] = -1
		$InGameStats[$i][$y] = -1
		$InGameStats[$i][$time] = 0
	Else
		If Not $JustTesting Then _GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$i] & " took " & $dmg & " damage. ")
	EndIf
	If (Not $JustTesting) And ($i < 8) Then GUICtrlSetData($hpDisplay[$i], $InGameStats[$i][$hp] & " /")
EndFunc

Func AttackCharacter($destX, $destY)
	Local $offset = ($TurnQueue[0] < $TeamMembers) ? 0 : $TeamMembers
	$attacked = True
	If Not $JustTesting Then _GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$TurnQueue[0]] & " landed a basic attack. ")
	For $i = $TeamMembers - $offset To 2 * $TeamMembers - 1 - $offset
		If Distance($destX, $destY, $InGameStats[$i][$x], $InGameStats[$i][$y]) <= $InGameStats[$TurnQueue[0]][$area] Then _
				CharacterDamage($i, 1)
	Next
	If Not $JustTesting Then _GUICtrlEdit_AppendText($BattleLog, @CRLF)
	RedrawWindow()
EndFunc

Func FinalDamage($damage, $defense)
	Return ($defense >= 0) ? Round($damage * 100 / (100 + $defense)) : Round($damage * (2 - (100 / (100 - $defense))))
EndFunc

Func MoveCharacter($destX, $destY)
	$InGameStats[$TurnQueue[0]][$x] = $destX
	$InGameStats[$TurnQueue[0]][$y] = $destY
	$InGameStats[$TurnQueue[0]][$mov] = $PlayerStats[$TurnQueue[0]][$mov]
	$moved = True
	If Not $JustTesting Then _
			_GUICtrlEdit_AppendText($BattleLog, $PlayerNames[$TurnQueue[0]] & " moved to (" & $destX & ", " & $destY & ")." & @CRLF)
	RedrawWindow()
EndFunc

Func PauseBattle()
	Local $LastEndTurn = GUICtrlGetState($EndTurnButton), $LastAbility1 = GUICtrlGetState($Ability1), _
			$LastAbility2 = GUICtrlGetState($Ability2), $LastAbility3 = GUICtrlGetState($Ability3)
	GUICtrlSetState($EndTurnButton, $GUI_DISABLE)
	GUICtrlSetState($Ability1, $GUI_DISABLE)
	GUICtrlSetState($Ability2, $GUI_DISABLE)
	GUICtrlSetState($Ability3, $GUI_DISABLE)
	GUICtrlSetData($PauseButton, "Resume")
	Do
		$nMsg = GUIGetMsg()
		If $nMsg = $GUI_EVENT_CLOSE Then QuitConfirmation()
	Until $nMsg = $PauseButton
	GUICtrlSetState($EndTurnButton, $LastEndTurn)
	GUICtrlSetState($Ability1, $LastAbility1)
	GUICtrlSetState($Ability2, $LastAbility2)
	GUICtrlSetState($Ability3, $LastAbility3)
	GUICtrlSetData($PauseButton, "Pause")
EndFunc

Func InitializeCommands()
	RedrawWindow()
	If $attacked And $moved Then Return CompleteTurn()
	GUICtrlSetState($EndTurnButton, $GUI_ENABLE)
	GUICtrlSetData($CurrentLabel, $PlayerNames[$TurnQueue[0]])
	GUICtrlSetData($EndTurnButton, "End Turn")
	GUICtrlSetData($Ability1, "Move")
	GUICtrlSetData($Ability2, "Attack")
	GUICtrlSetData($Ability3, "Ability")
	GUICtrlSetState($Ability1, $moved ? $GUI_DISABLE : $GUI_ENABLE)
	GUICtrlSetState($Ability2, $attacked ? $GUI_DISABLE : $GUI_ENABLE)
	GUICtrlSetState($Ability3, $attacked ? $GUI_DISABLE : $GUI_ENABLE)
	GUICtrlSetState($Ability3, $GUI_DISABLE)
	GUICtrlSetData($Tooltip1, "Move: " & $InGameStats[$TurnQueue[0]][$mov])
	GUICtrlSetData($Tooltip2, "Attack: " & $InGameStats[$TurnQueue[0]][$atk])
	GUICtrlSetData($Tooltip3, "MP: " & $InGameStats[$TurnQueue[0]][$mp] & " / " & $PlayerStats[$TurnQueue[0]][$mp])
EndFunc

Func CompleteTurn()
	Local $TotalSurvivors = 0, $TotalHP = 0
	If $InGameStats[$TurnQueue[0]][$hp] > 0 Then
		If $attacked Then
			$InactiveTurns = 0
		Else
			$InactiveTurns += 1
			If (Not $JustTesting) And (Not Mod($InactiveTurns, 5)) And ($InactiveTurns < $TurnLimit) Then _
					_GUICtrlEdit_AppendText($BattleLog, _
					$InactiveTurns & " consecutive turns without attacking passed! " & _
					"The game will end if no one attacks within " & $TurnLimit & " turns." & @CRLF)
		EndIf
		If Not $JustTesting Then
			$turns += 1
			GUICtrlSetState($EndTurnButton, $GUI_DISABLE)
			GUICtrlSetData($CurrentLabel, "")
			GUICtrlSetState($Ability1, $GUI_DISABLE)
			GUICtrlSetState($Ability2, $GUI_DISABLE)
			GUICtrlSetState($Ability3, $GUI_DISABLE)
			GUICtrlSetData($Tooltip1, "")
			GUICtrlSetData($Tooltip2, "")
			GUICtrlSetData($Tooltip3, "")
			If (2 * $TeamMembers + 1) < 8 Then
				GUICtrlSetData($hpDisplay[2 * $TeamMembers + 1], $InactiveTurns & " /")
				GUICtrlSetData($atbBar[2 * $TeamMembers + 1], $turns)
			EndIf
		Else
			$TestingTurns += 1
		EndIf
		If $attacked And $moved Then
			$InGameStats[$TurnQueue[0]][$time] = Random(0, 500, 1)
		ElseIf Not ($attacked Or $moved) Then
			$InGameStats[$TurnQueue[0]][$time] = Random(2500, 5000, 1)
		Else
			$InGameStats[$TurnQueue[0]][$time] = Random(1000, 2000, 1)
		EndIf
		If $InactiveTurns >= $TurnLimit Then
			If Not $JustTesting Then _GUICtrlEdit_AppendText($BattleLog, _
					"Maximum number of consecutive turns without attacking was reached!" & @CRLF)
			For $i = 0 To $TeamMembers - 1
				If $InGameStats[$i][$hp] > 0 Then $TotalSurvivors += 1
			Next
			For $i = $TeamMembers To 2 * $TeamMembers - 1
				If $InGameStats[$i][$hp] > 0 Then $TotalSurvivors -= 1
			Next
			If $TotalSurvivors > 0 Then
				For $i = $TeamMembers To 2 * $TeamMembers - 1
					$InGameStats[$i][$hp] = 0
				Next
			ElseIf $TotalSurvivors < 0 Then
				For $i = 0 To $TeamMembers - 1
					$InGameStats[$i][$hp] = 0
				Next
			Else
				For $i = 0 To $TeamMembers - 1
					$TotalHP += $InGameStats[$i][$hp]
				Next
				For $i = $TeamMembers To 2 * $TeamMembers - 1
					$TotalHP -= $InGameStats[$i][$hp]
				Next
				If $TotalHP >= 0 Then
					For $i = $TeamMembers To 2 * $TeamMembers - 1
						$InGameStats[$i][$hp] = 0
					Next
				EndIf
				If $TotalHP <= 0 Then
					For $i = 0 To $TeamMembers - 1
						$InGameStats[$i][$hp] = 0
					Next
				EndIf
			EndIf
			For $i = 0 To 2 * $TeamMembers - 1
				If (Not $JustTesting) And ($i < 8) Then GUICtrlSetData($hpDisplay[$i], $InGameStats[$i][$hp] & " /")
			Next
		EndIf
	Else
		$InGameStats[$TurnQueue[0]][$time] = 0
		If Not $JustTesting Then
			GUICtrlSetState($EndTurnButton, $GUI_DISABLE)
			GUICtrlSetData($CurrentLabel, "")
			GUICtrlSetState($Ability1, $GUI_DISABLE)
			GUICtrlSetState($Ability2, $GUI_DISABLE)
			GUICtrlSetState($Ability3, $GUI_DISABLE)
			GUICtrlSetData($Tooltip1, "")
			GUICtrlSetData($Tooltip2, "")
			GUICtrlSetData($Tooltip3, "")
		EndIf
	EndIf
	$moved = False
	$attacked = False
	$queuers -= 1
	For $i = 0 To $queuers - 1
		If $i = 2 * $TeamMembers - 1 Then ExitLoop
		$TurnQueue[$i] = $TurnQueue[$i + 1]
	Next
	$TurnQueue[$queuers] = -1
	$InTurn = False
	RedrawWindow()
EndFunc

Func Annihilated($enemies)
	Local $offset = $enemies ? $TeamMembers : 0
	For $i = 0 + $offset To $TeamMembers - 1 + $offset
		If $InGameStats[$i][$hp] > 0 Then Return False
	Next
	Return True
EndFunc

Func RedrawWindow()
	If $JustTesting Or ($PlayMode = 2) Then Return
	_WinAPI_RedrawWindow($BattleGUI, 0, 0, $RDW_UPDATENOW)
	_GDIPlus_GraphicsDrawImageRect($hGraphic, $hImage, 0, 0, 32 * $MapSize, 32 * $MapSize)
	_GDIPlus_GraphicsDrawImageRect($hGraphic, $hImage2, 0, 0, 512, 512)
	For $i = 0 To $MapSize - 1
		For $j = 0 To $MapSize - 1
			If $region[$i][$j] Then _GDIPlus_GraphicsDrawImageRect($hGraphic, $hImage4, $i * 32, $j * 32, 32, 32)
		Next
	Next
	If $InTurn And Not $MarkAllies Then _GDIPlus_GraphicsDrawImageRect($hGraphic, $hImage3, $InGameStats[$TurnQueue[0]][$x] * 32, _
			$InGameStats[$TurnQueue[0]][$y] * 32, 32, 32)
	If $MarkAllies Then
		For $i = 0 To $TeamMembers - 1
			_GDIPlus_GraphicsDrawImageRect($hGraphic, $hImage3, $InGameStats[$i][$x] * 32, $InGameStats[$i][$y] * 32, 32, 32)
		Next
	EndIf
	For $i = 0 To $UnitsDispatched - 1
		If $InGameStats[$i][$hp] > 0 Then _GDIPlus_GraphicsDrawImageRect($hGraphic, $hCharacter[$i], _
				$InGameStats[$i][$x] * 32 + 8, $InGameStats[$i][$y] * 32 + 4, 16, 24)
	Next
	_WinAPI_RedrawWindow($BattleGUI, 0, 0, $RDW_VALIDATE)
EndFunc

Func ResetRegions()
	For $i = 0 To $MapSize - 1
		For $j = 0 To $MapSize - 1
			$region[$i][$j] = False
		Next
	Next
EndFunc

Func ShowInformation($player)
	Local $text = "Name: " & $PlayerNames[$player] & @CRLF & "Class: " & $classes[$PlayerStats[$player][$time]][$time] & @CRLF
	For $k = $hp To $mov
		$text &= $properties[$k] & ": " & $PlayerStats[$player][$k] & @CRLF
	Next
	MsgBox(0, "Information", $text)
EndFunc

Func GameOver()
	_GUICtrlEdit_AppendText($BattleLog, "Game ended after " & $turns & " turns!" & @CRLF)
	GUICtrlSetState($EndTurnButton, $GUI_DISABLE)
	GUICtrlSetState($PauseButton, $GUI_DISABLE)
	GUICtrlSetState($Ability1, $GUI_DISABLE)
	GUICtrlSetState($Ability2, $GUI_DISABLE)
	GUICtrlSetState($Ability3, $GUI_DISABLE)
	RedrawWindow()
	While 1
		If GUIGetMsg() = $GUI_EVENT_CLOSE Then QuitConfirmation()
	WEnd
EndFunc

Func QuitConfirmation()
	If MsgBox($MB_YESNO, "Quit?", "Are you sure you want to quit?") = $IDYES Then Exit
EndFunc

Func OnExit()
	_GDIPlus_ImageDispose($hImage)
	_GDIPlus_ImageDispose($hImage2)
	_GDIPlus_ImageDispose($hImage3)
	_GDIPlus_ImageDispose($hImage4)
	For $i = 0 To $TeamMembers * 2 - 1
		_GDIPlus_ImageDispose($hCharacter[$i])
	Next
	_GDIPlus_GraphicsDispose($hGraphic)
	_GDIPlus_Shutdown()
EndFunc
