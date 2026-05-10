part of 'auth_bloc.dart';

@immutable
sealed class AuthEvent extends Equatable{
  @override
  List<Object?> get props => [];
}

class LoginRequested extends AuthEvent {
  final String email;
  final String password;

  LoginRequested({required this.email, required this.password});

  @override
  List<Object?> get props => [email, password];
}

class LogoutRequested extends AuthEvent {
  @override
  List<Object?> get props => [];
}

class RegisterRequested extends AuthEvent {
  final String fullName;
  final String email;
  final String password;
  final String phone;

  RegisterRequested({required this.fullName, required this.email, required this.password, required this.phone});

  @override
  List<Object?> get props => [fullName, email, password, phone];
}

class ForgotPasswordRequested extends AuthEvent {
  final String email;

  ForgotPasswordRequested({required this.email});

  @override
  List<Object?> get props => [email];
}