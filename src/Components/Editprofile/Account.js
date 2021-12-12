import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts/Authcontext";
import { auth, database, storage } from "../../firebase";

export default function Account() {
  const { currentUser, updateEmail, deleteUser } = useAuth();
  const currentUserId = currentUser.uid;
  const currentUserEmail = currentUser.email;
  const [email, setEmail] = useState(currentUserEmail);
  const [emailWarning, setEmailWarning] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailPrivacy, setEmailPrivacy] = useState("");

  useEffect(() => {
    const user = database.ref("users/" + currentUserId);
    user.once("value", (snapshot) => {
      setEmailPrivacy(snapshot.val().Emailprivacy);
    });
  }, []);

  const handleUpdateEmail = async (e) => {
    e.preventDefault();

    if (email !== currentUserEmail) {
      try {
        setLoading(true);
        setError("");
        setMessage("");
        await updateEmail(email);
        setMessage("Account Updated Successfully!");
      } catch {
        setError("Failed to update account!");
      }
    }

    setLoading(false);
  };

  const deleteAccount = async () => {
    const deleteAccount = confirm("Are you sure you want to delete account?");

    if (deleteAccount) {
      try {
        setLoading(true);
        setMessage("");
        setError("Deleting Account..");
        await database.ref("users/" + currentUserId).remove();
        await storage.ref(`/profile-pictures/${currentUserId}`).delete();
        await auth.currentUser.delete();
        setError("");
        alert("Account deleted Successfully!");
        history.push("/");
      } catch {
        setError("Failed to delete account");
      }
    }
    setLoading(false);
  };

  return (
    <>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {message && (
        <div className="alert alert-success" role="alert">
          {message}
        </div>
      )}
      <div className="editprofile-component-header">
        <div className="editprofile-component-title">Account</div>
      </div>
      <form onSubmit={handleUpdateEmail}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label preference-formlabel">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailWarning(
                "By adding a new email, " +
                  currentUserEmail +
                  " will no longer associated with your account."
              );
              if (e.target.value === currentUserEmail) {
                setEmailWarning("");
              }
            }}
            aria-describedby="emailWarning"
            required
          />
          <div id="emailWarning" className="form-text" style={{ color: "red" }}>
            {emailWarning}
          </div>
        </div>

        <div className="mb-3">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              id="EmailPrivacy"
              value="EmailPrivacy"
              
            />
            <label class="form-check-label" for="EmailPrivacy">
              <div>Keep my Email address private.</div>
              <div className="email-privacy-desc">
                By making your email address public email address will appear on
                your public Codingpeer profile.
              </div>
            </label>
          </div>
        </div>

        <div className="field">
          <div className="mb-3">
            <button
              disabled={loading}
              type="submit"
              className="btn btn-primary"
            >
              Save Changes
            </button>
            <Link
              to={"/profile/" + currentUserId + "/"}
              type="button"
              class="btn btn-secondary mx-1"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>

      <div className="field">
        <div className="delete-account">
          <div className="delete-account-title">Delete Account</div>
          <div className="delete-account-sub-title">
            Once you delete your account, there is no going back. Please be
            certain.
          </div>
          <button
            type="button"
            disabled={loading}
            class="btn btn-outline-danger"
            onClick={deleteAccount}
          >
            Delete account
          </button>
        </div>
      </div>
    </>
  );
}
