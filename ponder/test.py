data = [7, 1, 4, 2]
length = len(data)

print(f'{"Row Name":<10}')

for i in range(length - 1, 0, -1):
    for j in range(i):
        if data[i] < data[j]:
            data[i], data[j] = data[j], data[i]

print(data)