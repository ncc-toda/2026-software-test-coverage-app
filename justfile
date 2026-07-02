default:
    @just --list

install:
    pnpm install

# 学生自身のカバレッジを測る（solution 除外）
cov:
    pnpm cov

# 模範解答込みのカバレッジ（教員用・約95%到達確認）
cov-solution:
    pnpm cov:solution

# 全テスト1回（solution 除外）
test:
    pnpm test

watch:
    pnpm test:watch

# 指定クラスだけ（例: just q TodoItem）
q name:
    pnpm exec vitest run {{name}}

typecheck:
    pnpm typecheck

# Expo 起動（動かしたい人向け・演習には不要）
start:
    pnpm start

clean:
    rm -rf node_modules coverage .vitest
