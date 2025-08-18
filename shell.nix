let
  nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/archive/ad7196ae55c2.tar.gz";
  pkgs = import nixpkgs { config = {}; overlays = []; };
in

pkgs.mkShellNoCC {
  packages = with pkgs; [
    nodejs
    git
  ];
}
