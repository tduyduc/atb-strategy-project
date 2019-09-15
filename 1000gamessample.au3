$GamesWon = 0
$i = 0
$file = FileOpen("1000gamessample.txt", 129)
OnAutoItExitRegister("OnExit")
While $i < 250
	TraySetToolTip("Games won: " & $GamesWon & "/" & $i)
	Switch RunWait('"' & @AutoItExe & '" "atbstrategyproject.au3" /ErrorStdOut')
		Case 101
			$GamesWon += 1
			FileWriteLine($file, ($i + 1) & ". Minimax player won")
		Case 102
			FileWriteLine($file, ($i + 1) & ". Monte Carlo player won")
		Case 103
			FileWriteLine($file, ($i + 1) & ". Drawn game")
			$i -= 1
		Case Else
			FileWriteLine($file, ($i + 1) & ". Unknown result")
			;Exit
	EndSwitch
	FileFlush($file)
	$i += 1
WEnd
Func OnExit()
	FileWriteLine($file, "Games won: " & $GamesWon & "/" & $i)
	FileClose($file)
EndFunc