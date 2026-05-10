part of 'auth_bloc.dart';

sealed class AuthState extends Equatable {
  @override
  List<Object?> get props => [];
}

final class AuthInitial extends AuthState {}
final class AuthLoading extends AuthState {}
final class AuthSuccess extends AuthState {
  final UserModel user;
  AuthSuccess(this.user);
  @override
  List<Object?> get props => [user];
}
final class AuthFailure extends AuthState {
  final String message;
  AuthFailure(this.message);
  @override
  List<Object?> get props => [message];
}

final class RegisterSuccess extends AuthState {}  
final class RegisterFailure extends AuthState {}
final class ForgotPasswordSuccess extends AuthState {}
