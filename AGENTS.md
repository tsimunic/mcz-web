# Upute za AI agente (Claude Code, Cursor, Copilot…)

Projekt: nova web stranica i okvir web shopa za Moto Centar Zagorje (Angular 21, statički prerender).
Pokretanje, struktura i objava su opisani u `README.md`.

Pravila u ovoj datoteci su **obavezna**. Primjenjuj ih automatski, bez pitanja, pri svakoj izmjeni
na koju se odnose. Ako ti zadatak traži nešto što je u sukobu s pravilom, prvo pitaj.

## Pravila

### 1. Nikad zadani efekt dodira na gumbima i linkovima

Na mobitelu preglednik pri dodiru oboji gumb ili link plavim, odnosno sivim pravokutnikom
(`-webkit-tap-highlight-color`). To se na ovoj stranici **nikad** ne smije vidjeti.

- Globalno je ugašeno u `src/styles.scss`: na `html` i u bloku **"Dodir i pritisak"**.
  Te linije ne briši i ne nadjačavaj.
- Kad dodaješ ili mijenjaš bilo što klikabilno (gumb, link, karticu, čip, karticu u banneru, ikonu,
  `[role="button"]`, `[tabindex]`), sam provjeri da efekta nema. Ako element nije pokriven globalnim
  pravilom (npr. `div` ili `span` s `(click)`), dodaj mu `-webkit-tap-highlight-color: transparent`.
  Još bolje, pretvori ga u pravi `<button>` ili `<a>`.
- Umjesto efekta preglednika svaki klikabilni element mora imati **vlastiti, diskretan odziv na
  pritisak**. Globalno: gumbi i `.btn` se na `:active` malo smanje (`scale(0.97)`), a linkovi
  posvijetle (`opacity: 0.7`). Poseban element smije imati svoj `:active` u bojama brenda, ali ne
  plavi, i ne smije ostati bez ikakvog odziva.
- **Ne uklanjaj** `:focus-visible` obrub (navigacija tipkovnicom, pristupačnost) i ne stavljaj
  `outline: none` bez vidljive zamjene.
- Provjera: preglednik u mobilnom prikazu (dodir), pritisni gumb ili link. Ne smije se pojaviti plavi
  ni sivi pravokutnik, a pritisak se mora vidjeti.

### 2. Git: samo čitanje, nikad promjene

Agent **nikad** ne pokreće git naredbu koja mijenja stanje repozitorija, ni lokalno ni na GitHubu.
Smije samo pregledavati. Ovo pravilo nema iznimku: i kad korisnik traži commit ili push, agent ga
ne izvršava sam, nego korisniku napiše točnu naredbu da je pokrene sam.

**Dozvoljeno (samo čitanje):** `git status`, `git diff` (i `--staged`), `git log`, `git show`,
`git blame`, `git branch` (samo popis, npr. `-a`, `-v`), `git remote -v`, `git ls-files`,
`git rev-parse`, `git config --get` / `--list` (samo čitanje), `git stash list`, `git tag` (samo popis).

**Zabranjeno (sve što dodaje, mijenja ili briše):**

- `add`, `commit`, `push`, `pull`, `fetch`, `merge`, `rebase`, `cherry-pick`, `revert`
- `checkout`, `switch`, `restore`, `reset`, `clean`, `rm`, `mv`
- `stash` (osim `stash list`), `tag` i `branch` koji stvaraju, mijenjaju ili brišu
- `init`, `clone`, `remote add/remove/set-url`, `config` koji upisuje, `submodule`, `worktree`, `gc`
- ručne izmjene unutar mape `.git/` i bilo kakve izmjene repozitorija na GitHubu (push, PR,
  release, tag, postavke)

Agent smije mijenjati datoteke projekta, ali ih ne stavlja u git: što će se commitati i kada,
odlučuje i izvršava korisnik. U poruci na kraju posla agent ne nudi da sam commita ili pusha.
