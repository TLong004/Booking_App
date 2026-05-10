import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hydrated_bloc/hydrated_bloc.dart';
import 'package:myapp/core/network/api_client.dart';
import 'package:myapp/main_page.dart';
import 'package:myapp/pages/login_register/login_screen.dart';
import 'package:myapp/logic/auth/auth_bloc.dart';
import 'package:myapp/pages/home/screens/search_screen.dart';
import 'package:myapp/pages/onboarding/onboarding_screen.dart';
import 'package:myapp/logic/doctor/doctor_bloc.dart';
import 'package:myapp/logic/service/service_bloc.dart';
import 'package:myapp/logic/specialty/specialty_bloc.dart';
import 'package:myapp/logic/patient/patient_bloc.dart';
import 'package:myapp/logic/appointment/appointment_bloc.dart';
import 'package:path_provider/path_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {
    await Firebase.initializeApp();
  } catch (e) {
    print("Lỗi khởi tạo Firebase: $e");
  }
  final storage = await HydratedStorage.build(
    storageDirectory: await getApplicationDocumentsDirectory(),
  );

  HydratedBloc.storage = storage;
  ApiClient.setupInterceptors();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget { 
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (context) => AuthBloc()),
        BlocProvider(create: (context) => SpecialtyBloc()),
        BlocProvider(create: (context) => DoctorBloc()),
        BlocProvider(create: (context) => ServiceBloc()),
        BlocProvider(create: (context) => PatientBloc()),
        BlocProvider(create: (context) => AppointmentBloc()),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        initialRoute: '/',
        routes: {
          '/': (context) => const OnboardingScreen(),
          '/main': (context) => const MainPage(),
          '/login': (context) => const LoginScreen(),
          '/search': (context) => const SearchScreen(),
        },
      ),
    );
  }
}