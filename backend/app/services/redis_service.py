class FakeRedis:
    def __init__(self):
        self.hashes = {}
        self.lists = {}

    def hset(self, key, field, value):
        self.hashes.setdefault(key, {})
        self.hashes[key][field] = value

    def hget(self, key, field):
        return self.hashes.get(key, {}).get(field)

    def hvals(self, key):
        return list(self.hashes.get(key, {}).values())

    def rpush(self, key, value):
        self.lists.setdefault(key, [])
        self.lists[key].append(value)

    def lrange(self, key, start, end):
        items = self.lists.get(key, [])

        if end == -1:
            return items[start:]

        return items[start:end + 1]


redis_client = FakeRedis()