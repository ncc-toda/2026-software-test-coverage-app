{
  description = "2026 ソフトウェアテスト授業: カバレッジ道場 (RN+Expo TODOアプリ)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            just
            nodejs_22
            pnpm
          ];
          shellHook = ''
            echo "coverage-dojo dev shell"
            echo "  node : $(node -v)"
            echo "  pnpm : $(pnpm -v)"
            echo "  just : $(just --version 2>/dev/null | head -n1)"
            echo ""
            echo "初回は 'just install' で依存関係を入れてください。"
            echo "カバレッジ確認は 'just cov' です。"
          '';
        };

        formatter = pkgs.nixfmt-rfc-style;
      }
    );
}
