# first install kind on ec2 then create a cluster with = kind create cluster --name kind-cluster

✅ Command to Create Cluster (1 Master + 2 Workers)

Create a config file first:

nano kind-cluster.yaml

Paste this:

kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:

- role: control-plane
- role: worker
- role: worker

Save and exit (CTRL + X → Y → Enter)

🚀 Create the cluster
kind create cluster --name my-cluster --config kind-cluster.yaml

==== install argo with kustomization

apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: argocd
resources:

- https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

kubectl apply -k . --server-side

== get argocd password
kubectl -n argocd get secret argocd-initial-admin-secret \
 -o jsonpath="{.data.password}" | base64 -d; echo
