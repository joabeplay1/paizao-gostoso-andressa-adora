using System;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Media;
using System.Windows.Threading;
using Windows.Networking.NetworkOperators;

namespace InternetSharePro
{
    public partial class MainWindow : Window
    {
        private DispatcherTimer _monitorTimer;
        private bool _isSharing = false;
        private Process? _gnirehtetProcess;

        public MainWindow()
        {
            InitializeComponent();
            _monitorTimer = new DispatcherTimer { Interval = TimeSpan.FromSeconds(3) };
            _monitorTimer.Tick += VerificarConexaoCelular;
            _monitorTimer.Start();
        }

        private string ExecutarAdb(string argumentos)
        {
            try
            {
                if (!File.Exists("adb.exe")) return "ADB ausente"; 
                var startInfo = new ProcessStartInfo { FileName = "adb.exe", Arguments = argumentos, RedirectStandardOutput = true, UseShellExecute = false, CreateNoWindow = true };
                using (var process = Process.Start(startInfo)) { return process?.StandardOutput.ReadToEnd() ?? string.Empty; }
            }
            catch { return string.Empty; }
        }

        private void VerificarConexaoCelular(object? sender, EventArgs e)
        {
            string resultado = ExecutarAdb("devices");
            if (resultado.Contains("\tdevice")) { TxtCelularStatus.Text = "Celular Pronto (USB Detectado)"; DotCelularStatus.Fill = new SolidColorBrush(Color.FromRgb(16, 124, 65)); }
            else if (resultado.Contains("\tunauthorized")) { TxtCelularStatus.Text = "Autorize o ADB no Celular"; DotCelularStatus.Fill = new SolidColorBrush(Color.FromRgb(247, 163, 26)); }
            else { TxtCelularStatus.Text = "Nenhum dispositivo USB ativo"; DotCelularStatus.Fill = new SolidColorBrush(Color.FromRgb(216, 59, 1)); }
        }

        private async void BtnCompartilhar_Click(object sender, RoutedEventArgs e)
        {
            if (_isSharing) { await InterromperCompartilhamento(); return; }

            if (RadioUsb.IsChecked == true)
            {
                if (!File.Exists("gnirehtet.exe")) { MessageBox.Show("Coloque o 'gnirehtet.exe' na pasta do app!", "Falta Arquivo"); return; }
                try
                {
                    _gnirehtetProcess = Process.Start(new ProcessStartInfo { FileName = "gnirehtet.exe", Arguments = "run", UseShellExecute = false, CreateNoWindow = true });
                    _isSharing = true; AlterarInterface(true);
                    TxtStatusGeral.Text = "Internet injetada via USB! Aceite a VPN no celular.";
                }
                catch (Exception ex) { TxtStatusGeral.Text = "Erro: " + ex.Message; }
            }
            else
            {
                if (await AlternarHotspotWindows(true)) { _isSharing = true; AlterarInterface(true); TxtStatusGeral.Text = "Hotspot Wi-Fi ligado!"; }
                else { TxtStatusGeral.Text = "Erro ao ligar Wi-Fi do PC."; }
            }
        }

        private async Task InterromperCompartilhamento()
        {
            if (_gnirehtetProcess != null && !_gnirehtetProcess.HasExited) { try { _gnirehtetProcess.Kill(); } catch {} _gnirehtetProcess = null; }
            await AlternarHotspotWindows(false);
            _isSharing = false; AlterarInterface(false);
            TxtStatusGeral.Text = "Compartilhamento encerrado.";
        }

        private void AlterarInterface(bool ativo)
        {
            BtnCompartilhar.Content = ativo ? "Parar Compartilhamento" : "Compartilhar Internet";
            BtnCompartilhar.Background = new SolidColorBrush(ativo ? Color.FromRgb(216, 59, 1) : Color.FromRgb(0, 120, 212));
            RadioUsb.IsEnabled = !ativo; RadioWifi.IsEnabled = !ativo;
        }

        private async Task<bool> AlternarHotspotWindows(bool ativar)
        {
            try
            {
                var profile = Windows.Networking.Connectivity.NetworkInformation.GetInternetConnectionProfile();
                if (profile == null) return false;
                var mgr = NetworkOperatorTetheringManager.CreateFromConnectionProfile(profile);
                if (mgr == null) return false;
                var res = ativar ? await mgr.StartTetheringAsync() : await mgr.StopTetheringAsync();
                return res.Status == TetheringOperationStatus.Success;
            }
            catch { return false; }
        }
    }
}
