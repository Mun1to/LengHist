// Ejemplos de código y nombres de archivo para la versión en inglés.
// Los originales viven en languages.js con el texto en español ("¡Hola, mundo!",
// "hola_mundo.py"); aquí solo están los que cambian al traducirse. Lo que no
// aparezca en este mapa se muestra igual en los dos idiomas.

export const CODE_EN = {
 "Python": {
  "example": "print(\"Hello, world!\")",
  "file": "hello_world.py"
 },
 "JavaScript": {
  "example": "console.log(\"Hello, world!\");",
  "file": "hello_world.js"
 },
 "Java": {
  "example": "class Main {\n  public static void main(String[] a) {\n    System.out.println(\"Hello, world!\");\n  }\n}"
 },
 "C": {
  "example": "#include <stdio.h>\nint main() {\n  printf(\"Hello, world!\\n\");\n  return 0;\n}",
  "file": "hello_world.c"
 },
 "C++": {
  "example": "#include <iostream>\nint main() {\n  std::cout << \"Hello, world!\\n\";\n}",
  "file": "hello_world.cpp"
 },
 "C#": {
  "example": "using System;\nConsole.WriteLine(\"Hello, world!\");",
  "file": "hello_world.cs"
 },
 "TypeScript": {
  "example": "const greeting: string = \"Hello, world!\";\nconsole.log(greeting);",
  "file": "hello_world.ts"
 },
 "Rust": {
  "example": "fn main() {\n    println!(\"Hello, world!\");\n}",
  "file": "hello_world.rs"
 },
 "Go": {
  "example": "package main\nimport \"fmt\"\nfunc main() {\n    fmt.Println(\"Hello, world!\")\n}",
  "file": "hello_world.go"
 },
 "PHP": {
  "example": "<?php\necho \"Hello, world!\";\n?>",
  "file": "hello_world.php"
 },
 "Swift": {
  "example": "print(\"Hello, world!\")",
  "file": "hello_world.swift"
 },
 "Kotlin": {
  "example": "fun main() {\n    println(\"Hello, world!\")\n}",
  "file": "hello_world.kt"
 },
 "R": {
  "example": "cat(\"Hello, world!\\n\")",
  "file": "hello_world.r"
 },
 "SQL": {
  "example": "SELECT 'Hello, world!' AS greeting;",
  "file": "hello_world.sql"
 },
 "Ruby": {
  "example": "puts \"Hello, world!\"",
  "file": "hello_world.rb"
 },
 "Scala": {
  "example": "@main def hello() = println(\"Hello, world!\")",
  "file": "hello_world.scala"
 },
 "Haskell": {
  "example": "main :: IO ()\nmain = putStrLn \"Hello, world!\"",
  "file": "hello_world.hs"
 },
 "Lua": {
  "example": "print(\"Hello, world!\")",
  "file": "hello_world.lua"
 },
 "Perl": {
  "example": "print \"Hello, world!\\n\";",
  "file": "hello_world.pl"
 },
 "Assembly": {
  "example": "section .data\n  msg db \"Hello, world!\",0\nsection .text\n  global _start",
  "file": "hello_world.asm"
 },
 "MATLAB": {
  "example": "disp('Hello, world!')",
  "file": "hello_world.m"
 },
 "Dart": {
  "example": "void main() {\n  print('Hello, world!');\n}",
  "file": "hello_world.dart"
 },
 "Fortran": {
  "example": "program hello\n  print *, \"Hello, world!\"\nend program hello",
  "file": "hello_world.f"
 },
 "Elixir": {
  "example": "IO.puts(\"Hello, world!\")",
  "file": "hello_world.ex"
 },
 "Bash / Shell": {
  "example": "#!/bin/bash\necho \"Hello, world!\"",
  "file": "hello_world.sh"
 },
 "Prolog": {
  "example": ":- initialization(main).\nmain :- write('Hello, world!'), nl.",
  "file": "hello_world.pl"
 },
 "Scratch": {
  "example": "al presionar 🏳\n  decir \"Hello, world!\" por 2 segundos",
  "file": "hello_world.sb"
 },
 "COBOL": {
  "example": "IDENTIFICATION DIVISION.\nPROGRAM-ID. HELLO.\nPROCEDURE DIVISION.\n    DISPLAY \"Hello, world!\".\n    STOP RUN.",
  "file": "hello_world.cob"
 },
 "Julia": {
  "example": "println(\"Hello, world!\")",
  "file": "hello_world.jl"
 },
 "Objective-C": {
  "example": "#import <Foundation/Foundation.h>\nint main() {\n  NSLog(@\"Hello, world!\");\n  return 0;\n}",
  "file": "hello_world.m"
 },
 "Erlang": {
  "example": "-module(hello).\n-export([start/0]).\nstart() -> io:format(\"Hello, world!~n\").",
  "file": "hello_world.erl"
 },
 "Clojure": {
  "example": "(println \"Hello, world!\")",
  "file": "hello_world.clj"
 },
 "F#": {
  "example": "printfn \"Hello, world!\"",
  "file": "hello_world.fs"
 },
 "Visual Basic": {
  "example": "Module Hello\n  Sub Main()\n    Console.WriteLine(\"Hello, world!\")\n  End Sub\nEnd Module",
  "file": "hello_world.vb"
 },
 "Groovy": {
  "example": "println \"Hello, world!\"",
  "file": "hello_world.groovy"
 },
 "Pascal": {
  "example": "program Hello;\nbegin\n  writeln('Hello, world!');\nend.",
  "file": "hello_world.pas"
 },
 "Lisp": {
  "example": "(format t \"Hello, world!~%\")",
  "file": "hello_world.lisp"
 },
 "Solidity": {
  "example": "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\ncontract Hello {\n  string public greeting = \"Hello, world!\";\n}",
  "file": "hello_world.sol"
 },
 "Zig": {
  "example": "const std = @import(\"std\");\npub fn main() void {\n    std.debug.print(\"Hello, world!\\n\", .{});\n}",
  "file": "hello_world.zig"
 },
 "Nim": {
  "example": "echo \"Hello, world!\"",
  "file": "hello_world.nim"
 },
 "Crystal": {
  "example": "puts \"Hello, world!\"",
  "file": "hello_world.cr"
 },
 "OCaml": {
  "example": "let () = print_endline \"Hello, world!\"",
  "file": "hello_world.ml"
 },
 "Ada": {
  "example": "with Ada.Text_IO;\nprocedure Hello is\nbegin\n   Ada.Text_IO.Put_Line(\"Hello, world!\");\nend Hello;",
  "file": "hello_world.adb"
 },
 "Smalltalk": {
  "example": "Transcript show: 'Hello, world!'; cr.",
  "file": "hello_world.st"
 },
 "GDScript": {
  "example": "func _ready():\n    print(\"Hello, world!\")",
  "file": "hello_world.gd"
 },
 "PowerShell": {
  "example": "Write-Host \"Hello, world!\"",
  "file": "hello_world.ps1"
 },
 "Scheme": {
  "example": "(display \"Hello, world!\")\n(newline)",
  "file": "hello_world.scm"
 },
 "ABAP": {
  "example": "WRITE 'Hello, world!'.",
  "file": "hello_world.abap"
 },
 "Haxe": {
  "example": "class Main {\n  static function main() {\n    trace(\"Hello, world!\");\n  }\n}",
  "file": "hello_world.hx"
 },
 "Elm": {
  "example": "import Html exposing (text)\n\nmain =\n  text \"Hello, world!\"",
  "file": "hello_world.elm"
 },
 "Racket": {
  "example": "#lang racket\n(display \"Hello, world!\")\n(newline)",
  "file": "hello_world.rkt"
 },
 "CoffeeScript": {
  "example": "console.log \"Hello, world!\"",
  "file": "hello_world.coffee"
 },
 "D": {
  "example": "import std.stdio;\n\nvoid main() {\n  writeln(\"Hello, world!\");\n}",
  "file": "hello_world.d"
 },
 "V": {
  "example": "fn main() {\n  println(\"Hello, world!\")\n}",
  "file": "hello_world.v"
 },
 "Vala": {
  "example": "void main() {\n  print(\"Hello, world!\\n\");\n}",
  "file": "hello_world.vala"
 },
 "Hack": {
  "example": "<<__EntryPoint>>\nfunction main(): void {\n  echo \"Hello, world!\\n\";\n}",
  "file": "hello_world.hack"
 },
 "Raku": {
  "example": "say \"Hello, world!\";",
  "file": "hello_world.raku"
 },
 "Tcl": {
  "example": "puts \"Hello, world!\"",
  "file": "hello_world.tcl"
 },
 "AWK": {
  "example": "BEGIN { print \"Hello, world!\" }",
  "file": "hello_world.awk"
 },
 "Standard ML": {
  "example": "print \"Hello, world!\\n\";",
  "file": "hello_world.sml"
 },
 "Gleam": {
  "example": "import gleam/io\n\npub fn main() {\n  io.println(\"Hello, world!\")\n}",
  "file": "hello_world.gleam"
 },
 "VHDL": {
  "example": "entity hello is end;\narchitecture sim of hello is\nbegin\n  process begin\n    report \"Hello, world!\";\n    wait;\n  end process;\nend;",
  "file": "hello_world.vhd"
 },
 "Verilog": {
  "example": "module hello;\n  initial begin\n    $display(\"Hello, world!\");\n  end\nendmodule",
  "file": "hello_world.v"
 },
 "Apex": {
  "example": "System.debug('Hello, world!');",
  "file": "hello_world.apex"
 },
 "ActionScript": {
  "example": "trace(\"Hello, world!\");",
  "file": "hello_world.as"
 },
 "Eiffel": {
  "example": "class HELLO\ncreate make\nfeature\n  make do print(\"Hello, world!%N\") end\nend",
  "file": "hello_world.e"
 },
 "Forth": {
  "example": ".\" Hello, world!\"",
  "file": "hello_world.fth"
 },
 "APL": {
  "example": "'Hello, world!'",
  "file": "hello_world.apl"
 },
 "Wolfram Language": {
  "example": "Print[\"Hello, world!\"]",
  "file": "hello_world.nb"
 },
 "SAS": {
  "example": "data _null_;\n  put \"Hello, world!\";\nrun;",
  "file": "hello_world.sas"
 },
 "Idris": {
  "example": "main : IO ()\nmain = putStrLn \"Hello, world!\"",
  "file": "hello_world.idr"
 },
 "Coq": {
  "example": "Require Import Coq.Strings.String.\nDefinition hello := \"Hello, world!\".",
  "file": "hello_world.v"
 },
 "Lean": {
  "example": "def main : IO Unit :=\n  IO.println \"Hello, world!\"",
  "file": "hello_world.lean"
 },
 "Pony": {
  "example": "actor Main\n  new create(env: Env) =>\n    env.out.print(\"Hello, world!\")",
  "file": "hello_world.pony"
 },
 "Chapel": {
  "example": "writeln(\"Hello, world!\");",
  "file": "hello_world.chpl"
 },
 "PL/SQL": {
  "example": "BEGIN\n  DBMS_OUTPUT.PUT_LINE('Hello, world!');\nEND;",
  "file": "hello_world.pls"
 },
 "Batch": {
  "example": "@echo off\necho Hello, world!",
  "file": "hello_world.bat"
 },
 "AppleScript": {
  "example": "display dialog \"Hello, world!\"",
  "file": "hello_world.applescript"
 },
 "AutoHotkey": {
  "example": "MsgBox, Hello, world!",
  "file": "hello_world.ahk"
 },
 "Logo": {
  "example": "print [Hello, world!]",
  "file": "hello_world.logo"
 },
 "BASIC": {
  "example": "10 PRINT \"Hello, world!\"\n20 END",
  "file": "hello_world.bas"
 },
 "ALGOL": {
  "example": "begin\n  print(\"Hello, world!\")\nend",
  "file": "hello_world.alg"
 },
 "Simula": {
  "example": "begin\n  outtext(\"Hello, world!\");\n  outimage;\nend;",
  "file": "hello_world.sim"
 },
 "PL/I": {
  "example": "HELLO: PROCEDURE OPTIONS(MAIN);\n  PUT LIST('Hello, world!');\nEND HELLO;",
  "file": "hello_world.pli"
 },
 "RPG": {
  "example": "dsply 'Hello, world!';",
  "file": "hello_world.rpg"
 },
 "PostScript": {
  "example": "/Helvetica findfont 20 scalefont setfont\n72 700 moveto (Hello, world!) show\nshowpage",
  "file": "hello_world.ps"
 },
 "WebAssembly": {
  "file": "hello_world.wasm"
 },
 "GLSL": {
  "file": "hello_world.glsl"
 },
 "HLSL": {
  "file": "hello_world.hlsl"
 },
 "CUDA": {
  "example": "__global__ void hello() {\n  printf(\"Hello, world!\\n\");\n}",
  "file": "hello_world.cu"
 },
 "Vyper": {
  "example": "@external\ndef greeting() -> String[20]:\n    return \"Hello, world!\"",
  "file": "hello_world.vy"
 },
 "Move": {
  "example": "module hello::greeting {\n    public fun decir(): vector<u8> {\n        b\"Hello, world!\"\n    }\n}",
  "file": "hello_world.move"
 },
 "Cairo": {
  "example": "fn main() {\n    println!(\"Hello, world!\");\n}",
  "file": "hello_world.cairo"
 },
 "Red": {
  "example": "print \"Hello, world!\"",
  "file": "hello_world.red"
 },
 "Factor": {
  "example": "\"Hello, world!\" print",
  "file": "hello_world.factor"
 },
 "Io": {
  "example": "\"Hello, world!\" println",
  "file": "hello_world.io"
 },
 "Odin": {
  "example": "package main\nimport \"core:fmt\"\n\nmain :: proc() {\n  fmt.println(\"Hello, world!\")\n}",
  "file": "hello_world.odin"
 },
 "Hare": {
  "example": "use fmt;\n\nexport fn main() void = {\n  fmt::println(\"Hello, world!\")!;\n};",
  "file": "hello_world.ha"
 },
 "Mojo": {
  "example": "fn main():\n    print(\"Hello, world!\")",
  "file": "hello_world.mojo"
 },
 "Carbon": {
  "example": "fn Main() -> i32 {\n  Core.Print(\"Hello, world!\");\n  return 0;\n}",
  "file": "hello_world.carbon"
 }
}

// Devuelve el ejemplo y el nombre de archivo en el idioma pedido.
export const codeFor = (l, lang) =>
  lang === 'en' && CODE_EN[l.name]
    ? { example: CODE_EN[l.name].example ?? l.example, file: CODE_EN[l.name].file ?? l.file }
    : { example: l.example, file: l.file }
