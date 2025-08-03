{
  description = "Astal environment with required and optional tools";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    self,
    nixpkgs,
    home-manager,
  }: let
    # Helper function to generate outputs for each system
    forAllSystems = nixpkgs.lib.genAttrs [
      "x86_64-linux"
      "aarch64-linux"
      "x86_64-darwin"
      "aarch64-darwin"
    ];
  in {
    # Development shells
    devShells = forAllSystems (system: let
      pkgs = nixpkgs.legacyPackages.${system};

      # Required packages
      requiredPackages = with pkgs; [
        ags # CLI scaffolding tool
        dart-sass
        esbuild
      ];

      # Optional packages
      optionalPackages = with pkgs; [
        hyprpicker
        swappy
        wf-recorder
        wayshot
        slurp
        wl-clipboard # Provides wl-copy
        brightnessctl
      ];

      # GTK and GJS dependencies needed for typelibs
      gtkDeps = with pkgs; [
        gtk4
        gdk-pixbuf
        glib
        gobject-introspection
        pango
        cairo
        harfbuzz
        atk
        libadwaita
        webkitgtk_6_0
        gnome-bluetooth
      ];
    in {
      default = pkgs.mkShell {
        packages = with pkgs;
          [
            # Development tools
            nixpkgs-fmt
            nil # Nix language server
          ]
          ++ requiredPackages
          ++ optionalPackages
          ++ gtkDeps;

        # Shell hook for when you enter the shell
        shellHook = ''
          echo "Welcome to the Astal development environment!"
          echo ""
          echo "Required packages installed:"
          echo "  - ags, dart-sass, esbuild"
          echo ""
          echo "Optional packages installed:"
          echo "  - hyprpicker, swappy, wf-recorder, wayshot, slurp, wl-clipboard (wl-copy), brightnessctl"
          echo ""
          echo "GI_TYPELIB_PATH has been set to include GTK4 and other required typelibs"
        '';

        # Set GI_TYPELIB_PATH to help find required typelibs
        GI_TYPELIB_PATH = pkgs.lib.makeSearchPath "lib/girepository-1.0" gtkDeps;
      };
    });

    # Home Manager module
    homeManagerModules.default = {
      config,
      lib,
      pkgs,
      ...
    }: let
      cfg = config.programs.astalEnv;

      # GTK and GJS dependencies needed for typelibs
      gtkDeps = with pkgs; [
        gtk4
        gdk-pixbuf
        glib
        gobject-introspection
        pango
        cairo
        harfbuzz
        atk
        libadwaita
        webkitgtk_6_0
        gnome.gnome-bluetooth
      ];
    in {
      options.programs.astalEnv = {
        enable = lib.mkEnableOption "Astal environment with required and optional tools";

        installOptionalPackages = lib.mkOption {
          type = lib.types.bool;
          default = true;
          description = "Whether to install optional packages";
        };
      };

      config = lib.mkIf cfg.enable {
        home.packages = with pkgs;
          [
            # Required packages
            ags
            dart-sass
            esbuild
          ]
          ++ gtkDeps
          ++ lib.optionals cfg.installOptionalPackages (with pkgs; [
            # Optional packages
            hyprpicker
            swappy
            wf-recorder
            wayshot
            slurp
            wl-clipboard
            brightnessctl
          ]);

        # Set environment variables to help with typelib discovery
        home.sessionVariables = {
          GI_TYPELIB_PATH = lib.makeSearchPath "lib/girepository-1.0" gtkDeps;
        };
      };
    };
  };
}
