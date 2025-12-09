.data
b: .space 8
result: .space 8
a: .space 8
c: .space 8
d: .space 8
str0: .asciiz "Result= "
str1: .asciiz "\np0 is a cool language!\n"
str2: .asciiz "Result: "
str3: .asciiz "\nWhatever...\n"
str4: .asciiz "\nTANGINAMONAPS"

.code
daddiu r20, r0, #2
daddiu r21, r0, #33
daddiu r22, r0, #7
daddu r23, r21, r22
dmult r20, r23
mflo r3
sd r3, a(r0)
daddiu r20, r0, #3
daddiu r21, r0, #1
daddiu r22, r0, #0
dmult r21, r22
mflo r23
daddu r24, r20, r23
daddiu r25, r0, #-1
daddiu r26, r0, #1
dmult r25, r26
mflo r27
daddiu r28, r0, #2
daddu r29, r27, r28
daddu r1, r24, r29
sd r1, b(r0)
daddiu r20, r0, #-1
ld r3, a(r0)
ld r1, b(r0)
dmult r3, r1
mflo r21
dmult r20, r21
mflo r2
sd r2, result(r0)
ld r2, result(r0)
daddiu r20, r0, #2
dmult r2, r20
mflo r2
sd r2, result(r0)
daddiu r20, r0, #-1
daddiu r21, r0, #2
dmult r20, r21
mflo r5
sd r5, d(r0)
daddi r1, r0, str0
syscall 4
ld r2, result(r0)
dadd r1, r2, r0
syscall 1
daddi r1, r0, #32
syscall 11
daddi r1, r0, str1
syscall 4
daddi r1, r0, #10
syscall 11
ld r2, result(r0)
ld r3, a(r0)
daddu r20, r2, r3
dadd r1, r20, r0
syscall 1
daddi r1, r0, #32
syscall 11
daddi r1, r0, #10
syscall 11
ld r2, result(r0)
ld r3, a(r0)
daddu r20, r2, r3
dadd r1, r20, r0
syscall 1
daddi r1, r0, #32
syscall 11
daddi r1, r0, #10
syscall 11
daddi r1, r0, str2
syscall 4
ld r2, result(r0)
ld r3, a(r0)
daddiu r20, r0, #2
dmult r3, r20
mflo r21
daddu r22, r2, r21
dadd r1, r22, r0
syscall 1
daddi r1, r0, #32
syscall 11
daddi r1, r0, #10
syscall 11
ld r3, a(r0)
ld r1, b(r0)
dsubu r20, r3, r1
dadd r1, r20, r0
syscall 1
daddi r1, r0, #32
syscall 11
daddi r1, r0, str3
syscall 4
ld r2, result(r0)
dadd r1, r2, r0
syscall 1
daddi r1, r0, #32
syscall 11
daddi r1, r0, #10
syscall 11
ld r3, a(r0)
dadd r1, r3, r0
syscall 1
daddi r1, r0, #32
syscall 11
daddi r1, r0, #10
syscall 11
ld r1, b(r0)
syscall 1
daddi r1, r0, #32
syscall 11
daddi r1, r0, #10
syscall 11
ld r2, result(r0)
dadd r1, r2, r0
syscall 1
daddi r1, r0, #32
syscall 11
daddi r1, r0, str4
syscall 4
daddi r1, r0, #10
syscall 11
ld r3, a(r0)
dadd r1, r3, r0
syscall 1
daddi r1, r0, #32
syscall 11
daddi r1, r0, #10
syscall 11
