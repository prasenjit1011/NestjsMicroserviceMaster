import random
print("Invest In A Company")
print("Terms And Conditions Apply")
A=str(input("Company Name:\n"))
B=int(input("Amount Of The Investment:\n"))
if B <= 2000:
  print("Failed\n", "Amount Of Investment Is Lower Than 2000")
else:
  print("Success")
  C=12/100
  D=C*B
  E=B+D
  F=B-D
  if random.random() < 0.5:
    print("Investment Resulted In A Profit Of 12%:", E)
  else:
    print("Investment Resulted In A Loss Of 12%:", F)
