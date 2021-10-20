step_time = 50
start_rate = 100
steps = 4

print("config:")
print("  environments:")
print("    node:")
print("      target: 'http://localhost:5555'")
print("      plugins:")
print("        statsd:")
print("          host: localhost")
print("          port: 8125")
print("          prefix: 'artillery-node'")
print("")
print("  pool: 50")
print("")
print("  phases:")
print("    - name: WarmUp")
print("      duration: 10")
print("      arrivalRate: 5")
print("")

for n in range(1, steps + 1):
    print(f"    - name: Step {n}")
    print(f"      duration: {step_time}")
    print(f"      arrivalRate: {start_rate * (2 ** n)}")

print("")
print("    - name: WindDown")
print("      duration: 10")
print("      arrivalRate: 5")
print("")
print("scenarios:")
print("  - name: endpoint")
print("    flow:")
print("      - get:")
print("          url: '/ping'")
