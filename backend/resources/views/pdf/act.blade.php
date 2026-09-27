<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #0B1C3E; font-size: 12px; }
        h1 { font-size: 18px; margin: 0 0 4px; }
        h2 { font-size: 13px; margin: 18px 0 6px; }
        .muted { color: #52607a; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 4px 0; vertical-align: top; }
        td.k { width: 38%; color: #52607a; }
        .logo { height: 52px; }
        .foot { margin-top: 28px; font-size: 10px; color: #52607a; }
    </style>
</head>
<body>
    @if ($logo !== null)
        <img class="logo" src="{{ $logo }}" alt="CEEAC">
    @endif
    <p class="muted">Commission de la CEEAC — GESBUDEP</p>
    <h1>{{ $title }}</h1>
    <p class="muted">{{ $reference }}</p>

    <h2>Acte</h2>
    <table>
        @foreach ($rows as $row)
            <tr>
                <td class="k">{{ $row['label'] }}</td>
                <td>{{ $row['value'] }}</td>
            </tr>
        @endforeach
    </table>

    @if ($lines !== [])
        <h2>Sous-lignes</h2>
        <table>
            @foreach ($lines as $line)
                <tr><td>{{ $line }}</td></tr>
            @endforeach
        </table>
    @endif

    @if ($pieces !== [])
        <h2>Pièces</h2>
        <table>
            @foreach ($pieces as $piece)
                <tr><td>{{ $piece }}</td></tr>
            @endforeach
        </table>
    @endif

    <h2>Décisions</h2>
    <table>
        @forelse ($decisions as $decision)
            <tr><td>{{ $decision }}</td></tr>
        @empty
            <tr><td>Aucune décision enregistrée.</td></tr>
        @endforelse
    </table>

    <p class="foot">Identifiant de vérification {{ $verificationId }}. L’empreinte SHA-256 est celle du fichier archivé dans la GED.</p>
</body>
</html>
