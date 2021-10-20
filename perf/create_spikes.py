base_time = 60
base_rate = 100
spike_time = 20
spike_rate = 1000
spikes_count = 3

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

print("    - name: Base 0")
print(f"      duration: {base_time}")
print(f"      arrivalRate: {base_rate}")

for n in range(1, spikes_count + 1):
    print(f"    - name: Spike {n}")
    print(f"      duration: {spike_time}")
    print(f"      arrivalRate: {spike_rate}")
    print(f"    - name: Base {n}")
    print(f"      duration: {base_time}")
    print(f"      arrivalRate: {base_rate}")

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
