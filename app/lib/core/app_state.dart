import 'package:flutter/widgets.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'data/bundle.dart';
import 'i18n.dart';

/// The person's choices, kept on the phone: language, larger text, save data.
class AppState extends ChangeNotifier {
  AppState(this.bundle, this._prefs, {Lang? lang, this.largeText = false, this.lowData = false}) : lang = lang ?? Lang.tr;

  final AppBundle bundle;
  final SharedPreferences _prefs;
  Lang lang;
  bool largeText;
  bool lowData;

  Strings get s => bundle.strings(lang);
  SharedPreferences get prefs => _prefs;

  /// The first time, the phone's own language decides (Turkish if it is none of the three).
  static Future<AppState> load(AppBundle bundle, {String? deviceLanguage}) async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString('lang');
    return AppState(
      bundle,
      prefs,
      lang: langFromCode(saved ?? deviceLanguage),
      largeText: prefs.getBool('largeText') ?? false,
      lowData: prefs.getBool('lowData') ?? false,
    );
  }

  void setLang(Lang value) {
    lang = value;
    _prefs.setString('lang', value.name);
    notifyListeners();
  }

  void setLargeText(bool value) {
    largeText = value;
    _prefs.setBool('largeText', value);
    notifyListeners();
  }

  void setLowData(bool value) {
    lowData = value;
    _prefs.setBool('lowData', value);
    notifyListeners();
  }
}

/// Makes the state reachable from every screen: `App.of(context)`, and `context.s` for the words.
class App extends InheritedNotifier<AppState> {
  const App({super.key, required AppState state, required super.child}) : super(notifier: state);

  static AppState of(BuildContext context) => context.dependOnInheritedWidgetOfExactType<App>()!.notifier!;
}

extension AppContext on BuildContext {
  AppState get app => App.of(this);
  Strings get s => App.of(this).s;
  Lang get lang => App.of(this).lang;
  AppBundle get bundle => App.of(this).bundle;
}
